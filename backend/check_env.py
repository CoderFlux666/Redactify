import os
from dotenv import load_dotenv

load_dotenv()

print(f"SUPABASE_SERVICE_ROLE_KEY exists: {'SUPABASE_SERVICE_ROLE_KEY' in os.environ}")
print(f"SUPABASE_KEY exists: {'SUPABASE_KEY' in os.environ}")
