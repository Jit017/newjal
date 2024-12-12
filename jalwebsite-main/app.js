// File: app.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const AWS = require('aws-sdk');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(passport.initialize());

// Database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// User model
const User = mongoose.model('User', {
  username: String,
  email: String,
  password: String,
  profilePicture: String,
  bio: String,
  badges: [String],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  waterSavingTips: [{
    content: String,
    createdAt: Date
  }],
  points: Number
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// File upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// OAuth Configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  // Handle Google authentication
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        // Other fields...
      });
      await user.save();
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  // Handle Facebook authentication
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        // Other fields...
      });
      await user.save();
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

// Routes

// User registration
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

// User login
app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } else {
    res.status(400).send('Invalid credentials');
  }
});

// OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
  const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

// Profile management
app.get('/profile', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.json(user);
});

app.put('/profile', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.username = req.body.username || user.username;
    user.bio = req.body.bio || user.bio;

    if (req.file) {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `profile-pictures/${req.user.userId}-${Date.now()}.jpg`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const uploadResult = await s3.upload(params).promise();
      user.profilePicture = uploadResult.Location;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).send('Error updating profile');
  }
});

// Achievements and Badges
app.post('/award-badge', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.badges.push(req.body.badge);
    await user.save();
    res.json(user.badges);
  } catch (error) {
    res.status(500).send('Error awarding badge');
  }
});

// Follow/Unfollow functionality
app.post('/follow/:userId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const userToFollow = await User.findById(req.params.userId);

    if (!user.following.includes(userToFollow._id)) {
      user.following.push(userToFollow._id);
      userToFollow.followers.push(user._id);
      await user.save();
      await userToFollow.save();
    }

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    res.status(500).send('Error following user');
  }
});

app.post('/unfollow/:userId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const userToUnfollow = await User.findById(req.params.userId);

    user.following = user.following.filter(id => !id.equals(userToUnfollow._id));
    userToUnfollow.followers = userToUnfollow.followers.filter(id => !id.equals(user._id));

    await user.save();
    await userToUnfollow.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).send('Error unfollowing user');
  }
});

// Water-saving tips
app.post('/tips', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.waterSavingTips.push({
      content: req.body.content,
      createdAt: new Date()
    });
    await user.save();
    res.json(user.waterSavingTips);
  } catch (error) {
    res.status(500).send('Error adding tip');
  }
});

app.put('/tips/:tipId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const tip = user.waterSavingTips.id(req.params.tipId);
    if (tip) {
      tip.content = req.body.content;
      await user.save();
      res.json(tip);
    } else {
      res.status(404).send('Tip not found');
    }
  } catch (error) {
    res.status(500).send('Error updating tip');
  }
});

app.delete('/tips/:tipId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.waterSavingTips = user.waterSavingTips.filter(tip => !tip._id.equals(req.params.tipId));
    await user.save();
    res.json({ message: 'Tip deleted successfully' });
  } catch (error) {
    res.status(500).send('Error deleting tip');
  }
});

// Leaderboard
app.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find().sort('-points').limit(10).select('username points');
    res.json(leaderboard);
  } catch (error) {
    res.status(500).send('Error fetching leaderboard');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// File: package.json
{
  "name": "water-conservation-platform",
  "version": "1.0.0",
  "description": "Backend for water conservation platform",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.17.1",
    "mongoose": "^5.12.3",
    "bcrypt": "^5.0.1",
    "jsonwebtoken": "^8.5.1",
    "multer": "^1.4.2",
    "aws-sdk": "^2.879.0",
    "passport": "^0.4.1",
    "passport-google-oauth20": "^2.0.0",
    "passport-facebook": "^3.0.0"
  },
  "devDependencies": {
    "jest": "^26.6.3",
    "supertest": "^6.1.3"
  }
}

// File: .env (example)
MONGODB_URI=mongodb://localhost:27017/water_conservation
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
S3_BUCKET_NAME=your_s3_bucket_name
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

// File: Dockerfile
FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]

// File: .github/workflows/main.yml (CI/CD pipeline)
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14.x'
    - run: npm ci
    - run: npm test

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "your-heroku-app-name"
        heroku_email: "your-email@example.com"
Last edited 2 minutes ago


