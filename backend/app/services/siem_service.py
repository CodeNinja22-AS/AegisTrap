import asyncio
import httpx

async def send_to_siem(log_data):
    """
    Simulates sending log data to a Secure Information and Event Management (SIEM) system.
    """
    print(f"[SIEM] Streaming log for attack type: {log_data.get('attack_type', 'unknown').upper()}")
    
    # Simulate network latency
    # In a real scenario, this would be a POST to an actual endpoint
    try:
        # Mocking an external call (non-blocking)
        # await asyncio.sleep(0.1) 
        pass
    except Exception as e:
        print(f"[SIEM] Connection failed: {str(e)}")

    return True
