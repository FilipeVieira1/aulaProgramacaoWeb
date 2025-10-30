#!/usr/bin/env python3
"""Pequeno servidor HTTPS para desenvolvimento local.

Uso: py -3 scripts/run_https.py 4443 cert.pem key.pem
"""
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl

def run(port, cert, key):
    server_address = ('', port)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    httpd.socket = ssl.wrap_socket(httpd.socket, certfile=cert, keyfile=key, server_side=True)
    print(f"Servindo HTTPS em https://localhost:{port}")
    httpd.serve_forever()

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print('Usage: run_https.py <port> <cert.pem> <key.pem>')
        sys.exit(1)
    port = int(sys.argv[1])
    cert = sys.argv[2]
    key = sys.argv[3]
    run(port, cert, key)
