# Front-end de Gerenciador de Tarefas

O objetivo deste projeto é o de permitir consulta, inclusão, modificação e exclusão de tarefas no banco de dados do projeto através da sua API.

## Requisitos

* Docker instalado

* Git instalado para clonar o repositório

## Como Utilizar

Para utilizar esta API, siga os passos abaixo:
### 1. Executando:
#### Executando com docker
Abrir um terminal no diretório raiz do projeto e executar:
```shell
docker run -p 80:80 -v $PWD:/usr/share/nginx/html --name front --rm nginx:alpine 
```  

#### Usando o Dockerfile
Abrir um terminal no diretório raiz do projeto e executar:
```shell
docker build -t personal-website:v1 .
docker run -dp 80:80 personal-website:v1
```

## API Externa pública

A API pública gratuita utilizada se chama [TextDB](https://textdb.dev) e é usada para compartilhar dados no formato de texto.  
Esta API utiliza um UUID V4 para identificar os dados compartilhados via post.  
  
Quando este website é carregado ele gera um UUID V4 único para este propósito. Quando
o botão de compartilhar (share) é acionado, o link de acesso à lista de tarefas é copiado, 
tendo o formato ```https://textdb.dev/data/<myUUID>```.
Com o link no clipboard é possível compartilhá-lo facilmente.


### Rotas da API Externa

- [POST] `https://textdb.dev/api/data/<myUUID>`
  

## Notas de Versão

### Versão 1.0.0 (julho/2024)

- Implementação inicial.
- Funcionalidade de adicionar, visualizar, remover e modificar tarefas.

## Autor

Este projeto foi desenvolvido por Samuelson E. V. e pode ser encontrado no [GitHub](https://github.com/samuelsonev).

## Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE](https://www.mit.edu/~amini/LICENSE.md) para obter detalhes.