import os
import re
import spacy
from supabase import create_client, Client
from typing import List, Dict, Optional

# Initialize Supabase Client
url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")

# Graceful fallback if env vars are missing (for development)
supabase: Optional[Client] = None
if url and key:
    try:
        supabase = create_client(url, key)
    except Exception as e:
        print(f"Failed to initialize Supabase client: {e}")

# Load SpaCy model (ensure 'en_core_web_lg' or 'en_core_web_sm' is installed)
try:
    nlp = spacy.load("en_core_web_lg")
except OSError:
    print("Downloading en_core_web_lg...")
    from spacy.cli import download
    download("en_core_web_lg")
    nlp = spacy.load("en_core_web_lg")

def get_user_rules(user_id: str) -> Dict:
    """
    Fetch redaction rules for a specific user from Supabase.
    """
    if not supabase:
        print("Supabase client not initialized.")
        return {"blocklist": [], "pii_categories": {}}

    try:
        response = supabase.table("redaction_rules").select("*").eq("user_id", user_id).execute()
        if response.data:
            return response.data[0]
    except Exception as e:
        print(f"Error fetching rules for user {user_id}: {e}")
    
    # Default rules if fetch fails or no rules found
    return {
        "blocklist": [],
        "pii_categories": {
            "names": True,
            "emails": True,
            "phone": True,
            "dates": True,
            "credit_cards": True
        }
    }

def redact_text_selectively(text: str, user_id: str) -> str:
    """
    Redact text based on user-specific rules (PII toggles and blocklist).
    """
    rules = get_user_rules(user_id)
    blocklist = rules.get("blocklist", [])
    pii_categories = rules.get("pii_categories", {})

    # 1. Apply Blocklist Redaction (Regex)
    for word in blocklist:
        if word:
            # Case-insensitive replacement
            pattern = re.compile(re.escape(word), re.IGNORECASE)
            text = pattern.sub("[REDACTED]", text)

    # 2. Apply SpaCy PII Redaction
    doc = nlp(text)
    redacted_text_list = list(text)
    
    # Map categories to SpaCy labels
    # PERSON, ORG, GPE, DATE, TIME, MONEY, PERCENT, FAC, LOC, PRODUCT, EVENT, WORK_OF_ART, LAW, LANGUAGE, NORP, ORDINAL, CARDINAL
    labels_to_redact = []
    
    if pii_categories.get("names"):
        labels_to_redact.append("PERSON")
    if pii_categories.get("dates"):
        labels_to_redact.append("DATE")
    # Note: SpaCy isn't great for emails/phones/credit cards out of the box compared to Presidio, 
    # but using SpaCy as requested. We can add Regex for these if SpaCy misses them.
    
    # Iterate entities in reverse order to maintain indices
    for ent in reversed(doc.ents):
        if ent.label_ in labels_to_redact:
            start = ent.start_char
            end = ent.end_char
            redacted_text_list[start:end] = "[REDACTED]"

    # Reconstruct text
    text = "".join(redacted_text_list)

    # 3. Regex Fallbacks for non-SpaCy entities (Email, Phone, Credit Card)
    if pii_categories.get("emails"):
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        text = re.sub(email_pattern, "[EMAIL_REDACTED]", text)
    
    if pii_categories.get("phone"):
        # Simple phone regex
        phone_pattern = r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
        text = re.sub(phone_pattern, "[PHONE_REDACTED]", text)

    if pii_categories.get("credit_cards"):
        # Simple credit card regex (16 digits)
        cc_pattern = r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b'
        text = re.sub(cc_pattern, "[CC_REDACTED]", text)

    return text
