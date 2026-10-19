from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser


def main() -> None:
    project_dir = Path(__file__).resolve().parent
    handler = partial(SimpleHTTPRequestHandler, directory=str(project_dir))
    server = ThreadingHTTPServer(("127.0.0.1", 8000), handler)
    print("Cloud Launchpad demo: http://localhost:8000")
    print("Serving on this computer only. Press Ctrl+C to stop.")
    webbrowser.open("http://localhost:8000")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Cloud Launchpad demo.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
