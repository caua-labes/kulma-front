# Kulma — Protótipo do app do cliente

Protótipo estático em **HTML e CSS puros** (com alguns trechos pontuais de JavaScript) do
aplicativo do cliente do Kulma — o marketplace de comércio local descrito no
[documento de projeto](../kulma-projeto-completo.md). Sem build, sem dependências, sem backend:
é a interface, para validar fluxo e identidade visual antes de partir para React Native.

## Como rodar

Qualquer servidor estático serve. Da raiz desta pasta:

```bash
python3 -m http.server 4173
```

Depois abra `http://localhost:4173`. Para acessar de outro aparelho na mesma rede Wi-Fi, use o IP
da máquina em vez de `localhost` (`ipconfig getifaddr en0` no macOS) e libere a porta no firewall
se necessário.

## Telas

| Arquivo | Tela |
|---|---|
| `index.html` | Menu principal — cidade consultada, carrossel de ofertas das lojas em que o cliente é inscrito, busca, categorias e as três abas Produtos / Ofertas / Lojas |
| `sede.html` | Perfil de uma sede — capa, endereço, assinatura, propagandas ativas, catálogo e horário de atendimento |
| `produto.html` | Detalhe de um produto, no formato do Mercado Livre e válido para qualquer item — galeria com várias fotos, variação, preço com desconto, entrega/retirada, estoque, compra, sede vendedora, características (principais e da categoria), opiniões e outras sedes |
| `propaganda.html` | Tela de uma propaganda — imagem da campanha, título, loja que anuncia e produtos da promoção |
| `styles.css` | Base compartilhada pelas páginas: tokens, reset, `.app` e os componentes de uso geral, incluindo as barras superior e inferior |
| `home.css` · `sede.css` · `produto.css` · `propaganda.css` | O que só aquela página usa; cada página carrega `styles.css` e, logo depois, o seu |

## O que se vende: de tudo

O Kulma é comércio local **em geral**, não aplicativo de comida: informática, construção, moda,
farmácia, pet, casa, papelaria… O formato do iFood foi usado só como referência de navegação.
Os dados mockados seguem isso (lojas de Blumenau como Ponto Digital, Casa Firme, Ateliê Garcia,
Farmácia Vila Nova e Pet Itoupava), e a tela de produto é **genérica**, válida para qualquer item:

- **Variação** opcional, com o nome do atributo vindo do produto (Cor, Tamanho, Voltagem…).
- **Características** em duas tabelas: as *principais*, que todo produto tem (marca, modelo,
  categoria, condição, garantia, dimensões, peso, código de barras), e as *da categoria*, que mudam
  conforme o tipo de item.
- Nada específico de alimento (validade, ingredientes, alergênicos).

## Imagens

As fotos ficam em `img/` (`produtos/`, `banners/`, `lojas/`, `projetos/`), baixadas da
[Unsplash](https://unsplash.com) sob a [licença Unsplash](https://unsplash.com/license) — uso
livre, inclusive comercial, sem atribuição obrigatória. São só exemplo: no app real a foto vem do
catálogo (`product.photo_url`, `advertisement.photo_url`). No HTML, quem tem foto leva `.has-img`
e a `<img class="media-img">` preenche a caixa (CSS em `styles.css`).

## Regra: barras em todas as telas

**Toda tela tem a mesma barra superior e a mesma barra inferior**, sem exceção:

- **Superior (`.topbar`)** — busca sublinhada em navy e, à direita, o pin com a cidade
  (Blumenau / SC), que abre o pop-up de troca de cidade.
- **Inferior (`.tabbar`)** — Início, Explorar, Sacola, Pedidos e Conta.

O CSS das duas mora em `styles.css`. Uma tela pode acrescentar coisas entre elas (capa, galeria,
a sacola da sede logo acima da barra inferior), mas nunca trocá-las por uma barra própria. O
voltar das telas internas é o botão redondo sobre a capa ou a foto.

Navegação entre elas é por link direto (`<a href="...">`); não há roteador nem estado
compartilhado entre páginas.

## Identidade visual

Definida na seção 7 do documento de projeto: fundo branco, com o vermelho **restrito a detalhes**
(preço, botão principal, badge de urgência, contador do carrinho) e o azul meia-noite carregando
texto, ícones, bordas e estado ativo.

| Token | Valor | Uso |
|---|---|---|
| `--navy` | `#132A45` | Texto, ícones, bordas, estado ativo, botão de busca |
| `--red` | `#D6293B` | Preço, botão principal, badge de urgência, contador do carrinho |
| `--surface` / `--canvas` | `#FFFFFF` / `#E9EDF2` | Fundo dos cartões / fundo da página fora do "aparelho" |

Tipografia: **Space Grotesk** (títulos, `--display`) + **Inter** (corpo, `--body`), via Google
Fonts. Assinaturas visuais: pin de localização na marca e divisor pontilhado sugerindo rota entre
seções.

## Interações sem JavaScript

A maior parte do protótipo é interativa usando só `:checked` / `:target` em elementos escondidos —
nenhuma biblioteca, nenhum framework:

- **Abas Produtos / Ofertas / Lojas** — três `<input type="radio">` escondidos trocam qual painel
  aparece.
- **Categorias** (pirâmide 4 linhas, rolando juntas) — cada chip é um `<input type="checkbox">` +
  `<label>`; mais de uma pode ficar marcada ao mesmo tempo, e desmarcar todas volta a mostrar tudo.
- **Pop-up de troca de cidade** — um `<input type="checkbox">` comanda abrir/fechar.
- **Produtos de cada oferta** (linha horizontal, até 10 itens + "Ver mais") — um checkbox por
  cartão de oferta expande a lista embaixo da barra.

## O único JavaScript do protótipo

`index.html` carrega um `<script>` de ~15 linhas, só para sincronizar a bolinha ativa do carrossel
de ofertas do topo com o slide que está na tela durante o scroll — usa `IntersectionObserver`.
Esse é o único comportamento que checkbox/radio não resolvem, por depender da posição de rolagem
em tempo real.

## Limitações conhecidas

- **Dado é tudo mockado**, embutido direto no HTML (lojas, produtos, preços, ofertas). Não há
  API, banco ou integração com o backend `kulma-core`.
- **Filtros são só visuais.** Marcar uma categoria ou trocar de cidade muda a aparência do
  controle, mas não filtra de fato os cartões abaixo.
- **Botões de ação** (Adicionar ao carrinho, Reservar, Assinar) não têm efeito —
  não existe carrinho, sessão ou persistência.
- **3 de 18 telas** do fluxo do cliente mapeadas no documento de projeto (seção 7). Faltam
  Splash, Cadastro, Login, Resultado da Busca, Carrinho, Checkout, Adicionar Endereço,
  Confirmação, Meus Pedidos, Detalhe do Pedido, Reservar Produto, Minhas Reservas, Detalhe da
  Reserva, Avaliação e Perfil.

## Referência

Especificação completa do produto (regras de negócio, modelo de dados, API, decisões pendentes):
[`../kulma-projeto-completo.md`](../kulma-projeto-completo.md).
