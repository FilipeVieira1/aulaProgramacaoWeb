# Mãos que Acolhem — Site (aulaProgramacaoWeb)

Este repositório contém uma versão em HTML/CSS/JavaScript estática do site "Mãos que Acolhem" usada para aulas e demonstrações.

Conteúdo principal
- `index.html` (raiz): página inicial pública e menu principal.
- `html/`: páginas secundárias (admin.html, cadastro.html, doador.html, projeto.html, etc.).
- `css/styles.css`: folhas de estilo principais.
- `js/`: scripts de frontend (utilitários, menu, admin, donor, volunteer, validação).
- `imagens/`: imagens e logotipo.
- `scripts/`: scripts auxiliares (dev server helpers).

Visão geral
---------
O site é inteiramente cliente (front-end). Dados de projetos, doações e despesas são armazenados no navegador usando `localStorage`. Isso facilita testes locais sem backend, mas significa que os dados existem somente no navegador onde foram inseridos.

Principais chaves em `localStorage`
- `mq_projects` — array de projetos ({id, title, description, target, status, createdAt}).
- `mq_donations` — array de doações ({id, name, email, amount, projectId, createdAt}).
- `mq_expenses` — array de despesas.

Executar localmente (modo recomendado)
-----------------------------------
Recomendo usar a extensão Live Server do VS Code (mais simples e com reload automático). Dependendo de como o Live Server está configurado no seu VS Code, ele pode servir a pasta do projeto como raiz ou uma pasta acima — por isso existem duas URLs exemplo abaixo. Em ambos os casos, abra a URL indicada e, quando quiser a Área Admin, abra `html/admin.html`.

Passos rápidos (Live Server):

1. Abra a pasta do projeto no VS Code (`aulaProgramacaoWeb`).
2. Clique em "Go Live" (ou use o comando Live Server).
3. Abra uma das URLs abaixo (use a que corresponder ao caminho que o Live Server exibiu):

	- Se o Live Server estiver servindo diretamente a pasta do projeto como raiz:

	  http://127.0.0.1:5500/

	  então acesse a Admin em:

	  http://127.0.0.1:5500/html/admin.html

	- Se o Live Server estiver servindo o diretório pai (o caminho inclui o nome da pasta do projeto):

	  http://127.0.0.1:5500/aulaProgramacaoWeb/

	  então acesse a Admin em:

	  http://127.0.0.1:5500/aulaProgramacaoWeb/html/admin.html

Alternativa com Python (se tiver Python 3 instalado):

PowerShell (a partir da pasta `aulaProgramacaoWeb`):

```powershell
# inicia servidor HTTP simples na porta 8000
py -3 -m http.server 8000
```

Abra então: `http://localhost:8000/` e navegue até `html/admin.html`.

Testes básicos
--------------
- Criar projeto: abra `html/admin.html`, preencha o formulário "Cadastro de Projetos" e clique em Cadastrar. A lista de projetos deve atualizar.
- Fazer doação: abra `html/doador.html`, selecione o projeto criado e envie uma doação. Em `html/admin.html` o histórico de doações e o total doado devem refletir a operação.
- Exportar/Importar: a página Admin possui botões para exportar os dados em JSON e importar um arquivo JSON com a estrutura correta.

Diagnóstico e solução de problemas
----------------------------------
- Se uma página exibir "nada" ou a Admin estiver vazia, verifique se abriu `html/admin.html` (nem sempre a página raiz carrega os scripts admin).
- Abra o DevTools (F12) → Console e rode o self-check que está no projeto (pode colar o snippet fornecido pelo instrutor) para ver quais scripts e chaves do localStorage estão carregados.
- Problemas comuns:
  - `admin.js` não carregado: abra `html/admin.html` diretamente (ele é referenciado com path relativo `../js/admin.js`).
  - 404 ao publicar: confirme que `index.html` está na raiz do site no servidor; se estiver hospedando em Apache, use `.htaccess` (há um arquivo `.htaccess` de exemplo na raiz).

Melhorias e próximos passos
---------------------------
- Persistência no servidor (backend): se quiser dados centralizados entre vários usuários, implemente uma API (Node/Express, Firebase, etc.).
- Autenticação para área Admin: atualmente a área é pública — adicione proteção se for publicar em produção.
- Testes automatizados: criar testes unitários para utilitários e funções de persistência.

Scripts úteis
-------------
- `scripts/run_http.py` — helper para rodar um servidor local (pode depender de Python).

Remoção do banner de diagnóstico
--------------------------------
Quando finalizar os testes, recomendo remover o banner diagnóstico adicionado em `html/admin.html` (linha com `id="admin-diagnostics"`). Foi criado apenas para testes visuais.

Ajuda / contato
---------------
Se quiser, eu posso:
- retirar o banner diagnóstico automaticamente;
# Mãos que Acolhem — Protótipo Web (aulaProgramacaoWeb)

Resumo
------
Projeto acadêmico (protótipo) de um site estático para a ONG fictícia "Mãos que Acolhem". A aplicação é composta apenas por HTML, CSS e JavaScript no cliente. A finalidade é demonstrar conceitos de layout responsivo, manipulação do DOM e persistência local via localStorage para fins de ensino.

Estado do projeto
-----------------
- Frontend estático: páginas em `index.html` (raiz) e páginas secundárias em `html/`.
- Estilização central em `css/styles.css`.
- Lógica em `js/` (utilitários, menu, admin, donor, volunteer, validação).
- Imagens em `imagens/`.

Aviso importante
---------------
Este é um protótipo educacional. Não use este código em produção tal como está — armazenamento e autenticação são apenas simulados no cliente.

Estrutura do repositório
------------------------
- `index.html` — homepage (raiz do projeto)
- `html/` — páginas secundárias: `admin.html`, `cadastro.html`, `doador.html`, `projeto.html`, etc.
- `css/styles.css` — estilos do site
- `js/` — scripts (ex.: `mq-utils.js`, `menu.js`, `admin.js`, `donor.js`, `volunteer.js`)
- `imagens/` — arquivos de imagem (logotipo e ilustrações)
- `scripts/` — scripts auxiliares para desenvolvimento (opcional)

Como executar (ambiente de desenvolvimento)
-----------------------------------------
Pré-requisitos: um navegador moderno e, opcionalmente, VS Code com a extensão Live Server.

Opções recomendadas:

1) Usando Live Server (VS Code)

- Abra a pasta `aulaProgramacaoWeb` no VS Code.
- Clique em "Go Live" (Live Server) ou execute o comando correspondente.
- Abra a URL mostrada pelo Live Server. Dependendo da configuração, use uma das formas abaixo:

	- Se o Live Server servir a pasta do projeto como raiz:

		http://127.0.0.1:5500/

		A área administrativa estará em: `http://127.0.0.1:5500/html/admin.html`

	- Se o Live Server servir o diretório pai (a URL inclui o nome da pasta):

		http://127.0.0.1:5500/aulaProgramacaoWeb/

		A área administrativa estará em: `http://127.0.0.1:5500/aulaProgramacaoWeb/html/admin.html`

2) Usando Python (alternativa)

No PowerShell, dentro da pasta do projeto:

```powershell
py -3 -m http.server 8000
```

Abra `http://localhost:8000/` e navegue até `html/admin.html` quando quiser a área administrativa.

Funcionamento e dados
---------------------
- Persistência: os dados (projetos, doações, despesas, candidaturas, relatos) são salvos em `localStorage` do navegador.
- Principais chaves em `localStorage`:
	- `mq_projects` — projetos
	- `mq_donations` — doações
	- `mq_expenses` — despesas
	- `mq_applications` — candidaturas (voluntariado)

Recursos principais
-------------------
- Área Admin (`html/admin.html`): criar/visualizar projetos, ver histórico de doações, registrar despesas, exportar/importar dados JSON, gerar dados de exemplo e limpar dados de teste.
- Doações (`html/doador.html`): formulário de doação (simulado) e histórico pessoal.
- Cadastro/Voluntariado (`html/cadastro.html`): formulário público para cadastro e cadastro de projetos públicos.

Como testar (fluxo rápido)
-------------------------
1. Abra `html/admin.html` no navegador.
2. Use "Gerar dados de exemplo" para popular rapidamente a aplicação.
3. Abra `html/doador.html` e simule uma doação para um dos projetos.
4. Volte ao Admin e confirme que a doação aparece no histórico e que os totais são atualizados.

Ferramentas de diagnóstico
--------------------------
- Banner de diagnóstico (temporário) em `admin.html` mostra se `admin.js` está carregado e a quantidade de registros.
- Há um snippet de "self-check" (fornecido no material) que você pode colar no Console do DevTools para verificar scripts carregados e chaves do `localStorage`.

Exportar / Importar
-------------------
- A Admin permite exportar os dados atuais em JSON e importar um arquivo JSON com a mesma estrutura. Use isso para criar backups ou enviar resultados.

Boas práticas e limitações
-------------------------
- Este protótipo não possui backend. Para persistência real e multiusuário, implemente uma API (por exemplo com Node/Express, Firebase, etc.).
- A área administrativa está sem autenticação robusta — trate-a como protótipo apenas.

Checklist para entrega acadêmica
-------------------------------
- Verificar que as páginas estão acessíveis via Live Server ou servidor HTTP local.
- Demonstrar criação de projeto, doação e exportação de dados.
- Incluir no relatório da atividade referências às chaves de `localStorage` e instruções de importação/exportação.

Imagens e ativos
----------------
Arquivos de imagem presentes em `imagens/` (exemplos):
- `maosqueacolhem.png` (logotipo)
- `distribuicao_alimentos.jpg`, `acolhimento_suporte.jpg`, `educacao_capacitacao.jpg`, `cadastro.webp`, `doacao.png`, `quemsomos.jpg`.

Próximos passos recomendados (opcional)
-------------------------------------
- Mover os utilitários de modal para `js/mq-utils.js` e incluir o markup do modal em `index.html` para UX consistente em todas as páginas.
- Implementar backend simples para persistência centralizada e autenticação da área administrativa.
- Adicionar testes automatizados para as funções de utilidade.

Contato / Suporte
----------------
Se precisar que eu prepare: remoção do banner diagnóstico, centralização dos utilitários ou deploy em um serviço estático (GitHub Pages / Netlify), responda aqui e eu aplico as alterações.

---
Gerado/atualizado em 03/11/2025 — versão para submissão acadêmica.
