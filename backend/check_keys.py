import os
from dotenv import load_dotenv

load_dotenv()

anon = os.environ.get("SUPABASE_KEY")
service = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

print(f"Anon Key starts with: {anon[:10] if anon else 'None'}")
print(f"Service Key starts with: {service[:10] if service else 'None'}")

if anon == service:
    print("WARNING: Service Role Key is IDENTICAL to Anon Key!")
else:
    print("Keys are different.")
