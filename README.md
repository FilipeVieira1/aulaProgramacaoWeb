
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
