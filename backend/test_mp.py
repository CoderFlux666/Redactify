import mediapipe as mp
try:
    print(mp.solutions)
    print("Import successful")
except AttributeError as e:
    print(f"Error: {e}")
    import mediapipe.python.solutions
    print("Found via python.solutions")
