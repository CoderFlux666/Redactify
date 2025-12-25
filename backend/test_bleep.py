import os
import ffmpeg
import imageio_ffmpeg

# Configure FFmpeg path
ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
os.environ["PATH"] += os.pathsep + os.path.dirname(ffmpeg_path)
print(f"FFmpeg configured at: {ffmpeg_path}")

def _bleep_audio(input_path, output_path, intervals):
    between_filters = [f"between(t,{start},{end})" for start, end in intervals]
    enable_expr = "+".join(between_filters)
    
    try:
        input_stream = ffmpeg.input(input_path)
        
        # Muted original
        muted = input_stream.filter("volume", 0, enable=enable_expr)
        
        # Beep track
        beep = ffmpeg.input(f"sine=f=1000:d=3600", f="lavfi")
        beep = beep.filter("volume", 1, enable=enable_expr)
        beep = beep.filter("volume", 0, enable=f"not({enable_expr})")
        
        # Mix them
        output = ffmpeg.filter([muted, beep], 'amix', inputs=2, duration='first')
        
        (
            output
            .output(output_path)
            .overwrite_output()
            .run(cmd=ffmpeg_path, capture_stdout=True, capture_stderr=True)
        )
        print("Success!")
    except ffmpeg.Error as e:
        print("ffmpeg error:", e.stderr.decode('utf8'))
        raise e

# Test with dummy file
# Interval 1-2s and 3-4s
_bleep_audio("test.mp3", "test_out.mp3", [(1, 2), (3, 4)])