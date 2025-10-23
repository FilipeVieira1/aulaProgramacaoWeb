# aulaProgramacaoWeb

Este projeto é um protótipo de plataforma para a ONG "Mãos que Acolhem" com páginas para visitantes, doadores, voluntários e uma área administrativa (protótipo, sem backend).

Responsividade e como testar

- Implementação: o CSS é mobile-first (arquivo `styles.css`). Ele define estilos básicos, utilitários e breakpoints para telas maiores.
- Breakpoints principais: 640px e 900px (padrões para tablet/desktop). A navegação empilha em telas pequenas e fica horizontal em telas maiores.
- Imagens usam `class="responsive"` para ajustar a largura automaticamente.

Teste rápido local:

1. Abra o terminal na pasta do projeto e rode um servidor HTTP simples (recomendado):

```powershell
py -3 -m http.server 8000
```

2. Abra no navegador: `http://localhost:8000` e teste as páginas:
	- `index.html` — página inicial
	- `cadastro.html` — Portal do voluntário
	- `doador.html` — Doações e relatórios
	- `admin.html` — área administrativa (protótipo)

3. Use as ferramentas do desenvolvedor (DevTools) para alternar entre dispositivos (mobile / tablet / desktop) e verificar o comportamento responsivo.

Arquivos principais adicionados/alterados

- `styles.css` — estilos mobile-first e utilitários (novo)
- `admin.html`, `admin.js` — área administrativa (CRUD via localStorage)
- `admin-login.html`, `auth.js` — login protótipo para acessar admin
- `cadastro.html`, `volunteer.js` — portal do voluntário (oportunidades, candidaturas, relatos)
- `doador.html`, `donor.js`, `payment-sim.html`, `thankyou.html` — fluxo de doação simulado, relatórios
- `payment-sim.html`, `thankyou.html` — páginas de simulação/recibo
- `admin.html` agora permite registrar despesas por projeto (aplicação de recursos). Essas despesas são exibidas aos doadores como "Despesas" e o sistema mostra o "Saldo" restante (arrecadado - despesas) por projeto.

Observações

- Este é um protótipo educacional: autenticação e armazenamento não são seguros para produção. Para um sistema real, implemente backend, HTTPS e autenticação adequada.

HTTPS (ambiente de desenvolvimento)

- O repositório inclui `run_https.py`, um pequeno servidor HTTPS para testes locais que usa `cert.pem` e `key.pem`.
- Para gerar um certificado autoassinado (testes locais), execute (precisa do OpenSSL instalado):

```powershell
openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365
```

- Em seguida rode o servidor HTTPS (exemplo usando Python):

```powershell
py -3 run_https.py 4443 cert.pem key.pem
```

- Abra `https://localhost:4443` no navegador. Navegadores mostrarão aviso por se tratar de certificado autoassinado — você pode avançar para fins de desenvolvimento.

Segurança: certificados autoassinados não são seguros para produção. Para produção, obtenha certificados válidos (Let's Encrypt ou CA confiável) e configure um servidor web/proxy apropriado.
