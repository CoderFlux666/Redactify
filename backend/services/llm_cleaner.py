import pandas as pd
from services.rules_engine import redact_text_selectively
import os

# 1. Process a Dataset (e.g., CSV)
def process_dataset(input_file, output_file, text_column, user_id):
    print(f"Loading {input_file} for user {user_id}...")
    
    # Determine file type
    if input_file.endswith('.csv'):
        df = pd.read_csv(input_file)
    elif input_file.endswith('.jsonl') or input_file.endswith('.json'):
        try:
            # Try reading as JSONL (lines=True)
            df = pd.read_json(input_file, lines=True)
        except ValueError:
            # Fallback: Try reading as standard JSON array
            print("JSONL parsing failed, trying standard JSON...")
            df = pd.read_json(input_file)
    else:
        raise ValueError("Unsupported file format. Please upload CSV or JSONL.")
    
    # Smart Column Detection
    if text_column not in df.columns:
        print(f"Column '{text_column}' not found. Attempting auto-detection...")
        
        # 1. Try common variations
        common_names = ['chat_transcript', 'text', 'content', 'body', 'response', 'question', 'answer', 'prompt', 'completion']
        found_col = None
        for col in common_names:
            if col in df.columns:
                found_col = col
                break
        
        # 2. If not found, try the first string column that has long-ish text (heuristic)
        if not found_col:
            for col in df.columns:
                if df[col].dtype == 'object' or df[col].dtype == 'string':
                    # Check first non-null value to see if it looks like text
                    sample = df[col].dropna().iloc[0] if not df[col].dropna().empty else ""
                    if isinstance(sample, str) and len(sample) > 10:
                        found_col = col
                        break
        
        if found_col:
            print(f"Auto-detected text column: '{found_col}'")
            text_column = found_col
        else:
            raise ValueError(f"Could not automatically detect a text column. Please specify one of: {list(df.columns)}")

    print(f"Cleaning column: '{text_column}'...")
    
    # Apply the cleaning function using the rules engine
    # We use a lambda to pass the user_id to the redaction function
    df[f'cleaned_{text_column}'] = df[text_column].apply(
        lambda text: redact_text_selectively(str(text), user_id) if pd.notnull(text) else text
    )
    
    # Drop the original dirty column to be safe
    df = df.drop(columns=[text_column])
    
    print(f"Saving to {output_file}...")
    if output_file.endswith('.csv'):
        df.to_csv(output_file, index=False)
    elif output_file.endswith('.jsonl'):
        df.to_json(output_file, orient='records', lines=True)
    print("Done!")
    return output_file

