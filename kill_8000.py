import psutil

def kill_process_on_port(port):
    for proc in psutil.process_iter(['pid', 'name']):
        try:
            for conn in proc.connections(kind='inet'):
                if conn.laddr.port == port:
                    print(f"Killing process {proc.info['pid']} ({proc.info['name']}) on port {port}")
                    proc.kill()
        except (psutil.AccessDenied, psutil.NoSuchProcess):
            pass

kill_process_on_port(8000)
kill_process_on_port(3000)
