from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
# Mock database
articles_db = []

# Article Model
class Article(BaseModel):
    id: int
    title: str
    content: str
    image_url: str
    status: str = "pending"  # Default status is "pending"

# Endpoint to fetch all articles
@app.get("/articles", response_model=List[Article])
def get_articles():
    if not articles_db:
        return []
    return articles_db

# Endpoint to submit a new article
@app.post("/articles", response_model=dict)
def add_article(article: Article):
    # Check if the article ID already exists
    if any(existing_article["id"] == article.id for existing_article in articles_db):
        raise HTTPException(status_code=400, detail="Article ID already exists.")
    
    articles_db.append(article.dict())  # Convert Pydantic model to dict
    return {"message": "Article submitted successfully.", "article_id": article.id}

# Endpoint to verify an article
@app.patch("/articles/{article_id}/verify", response_model=dict)
def verify_article(article_id: int):
    for article in articles_db:
        if article["id"] == article_id:
            article["status"] = "approved"  # Update the status
            return {"message": "Article verified successfully.", "article_id": article_id}
    
    raise HTTPException(status_code=404, detail="Article not found.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)