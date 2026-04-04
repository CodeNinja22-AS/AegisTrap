import urllib.request
import json
import urllib.error
import urllib.parse

def test_api():
    url = "http://127.0.0.1:8000/attack?mode=live"
    data = {"input": "1 OR 1=1", "source": "web"}
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            print("Status:", response.status)
            print("Response:", response.read().decode())
    except urllib.error.HTTPError as e:
        print("HTTP Error:", e.code)
        print("Body:", e.read().decode())
    except Exception as e:
        print("Exception:", e)

if __name__ == "__main__":
    test_api()
