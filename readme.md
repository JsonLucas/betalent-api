# EasyBuy 🚀

## Sobre 📚
Bem-vindo ao **EasyBuy**! Esta aplicação é um **sistema de gestão de vendas** desenvolvido com **Adonis.js**, que permite o registro e controle de clientes, produtos e vendas em uma plataforma de _e-commerce_. O sistema utiliza autenticação baseada em **JWT (JSON Web Tokens)** para garantir a segurança e controle de acesso dos usuários, permitindo que **apenas usuários autenticados** possam interagir com os dados do sistema.

## Funcionalidades 📂
-   **Cadastro e Autenticação de Usuários**:
    -   Os usuários podem se cadastrar e fazer login para obter um **token JWT**, que será utilizado para autenticar as requisições subsequentes.
    -   O sistema diferencia **administradores** (que podem manipular produtos) e **clientes** (que podem apenas visualizar produtos e realizar compras).

-   **Gestão de Clientes**:
    -   Os administradores podem **adicionar, editar, listar e excluir clientes**, com dados como nome, CPF e informações de contato.
    -   Cada cliente possui um histórico de **vendas realizadas**, permitindo que seja possível visualizar suas compras anteriores.
   
- **Gestão de Produtos**:
    
    -   Os administradores podem **criar, editar e excluir produtos**, incluindo detalhes como nome, descrição e preço.
    -   A exclusão de produtos é feita de forma **lógica (soft delete)**, ou seja, os produtos são apenas marcados como removidos, mas não apagados do banco de dados.

-   **Gestão de Vendas**:
    -   **Clientes autenticados** podem realizar **compras**, associando um produto a sua conta, especificando a quantidade e o valor total da compra.
    -   As vendas são registradas, incluindo o **cliente, produto, quantidade, preço unitário, preço total e data/hora** da compra.
    -   **Relatórios de vendas** podem ser acessados, permitindo a visualização das compras feitas por um cliente, com a possibilidade de aplicar filtros por mês e ano.

## Tecnologias ⚙️

-   **Backend**: Adonis, Node.JS
-   **Banco de Dados**: MySQL
-   **Docker**: Para conteinerização do aplicativo

## Configurações e Pré-requisitos 🔧

-   **Node.js e npm**: Para o desenvolvimento e execução da api.
-	**MySQL**: Como servidor de banco de dados e armazenamento da aplicação
-   **Docker e Docker Compose** (Opcional): Para executar o projeto em contêineres.

### Para configuração com docker 🐋
Assegure-se que a engine do [Docker](https://docs.docker.com/get-started/get-docker/) está instalada e ativa na sua máquina e rode o comando: 
```bash
docker-compose up --build
```

### Para configuração sem docker 📌
1- Clone o Repositório
```bash
git clone <URL_DO_REPOSITORIO_BACKEND>
```
2- Navegue até a pasta do backend
```bash
cd <DIRETORIO_DO_BACKEND>
```
3- Instale as dependências do backend
```bash
npm i --legacy-peer-deps
```
4- Sincronize o banco de dados com seu servidor local de banco
```bash
node ace migration:setup
node ace migration:run
```
5- Execute o backend
```bash
npm run dev
```

## Acessando o Aplicativo 💻

Após a execução do backend e do frontend, você pode acessar a aplicação através do navegador em:
	**Documentação**: `http://localhost:3333/api/docs`
-   **Backend**: `http://localhost:3333/api`

## Executando Testes 📈

Para executar os testes do backend:
```bash
npm run test
```