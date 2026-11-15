# Kulma — Especificação das telas do app do cliente

Documento de preparação para a criação das telas pela equipe. Descreve, tela por tela, o que existe
no protótipo (`kulma-client-view prototype`): objetivo, blocos, dados, estados, interações e
navegação. O protótipo é a referência visual; este documento é a referência de comportamento.
Regras de negócio completas ficam em `../kulma-projeto-completo.md`.

> Todos os dados do protótipo são fictícios (lojas de Blumenau/SC). Onde o protótipo só simula
> (filtros, botões sem efeito, dados fixos no HTML), a coluna "Dados" indica o que o app real
> precisa buscar.

---

## 1. Princípios gerais

| Tema | Regra |
|---|---|
| Plataforma | Mobile-first, largura máxima de 430 px, projetado para 375 px. Futuro destino: React Native |
| O que se vende | **De tudo** (informática, construção, moda, farmácia, pet, casa…). Nada específico de comida. Referências: iFood (navegação) e Mercado Livre (página de produto) |
| Termo | **Carrinho** (nunca "sacola"), com ícone de carrinho em todo o app |
| Barras | Toda tela tem a mesma **barra superior** e a mesma **barra inferior**. Exceções: Splash, Login e Cadastro (sem barras); tela da loja (sem barra inferior, só botão redondo de Início em vidro fosco no canto esquerdo inferior) |
| Preço | Sem desconto: **azul**. Com desconto: **vermelho**, com o valor antigo riscado ao lado |
| Assinatura de loja | Não existe. Existe apenas **seguir a loja** (botão "+" outline; preenchido quando seguindo) |
| Pagamento | Fora do escopo desta versão; o checkout avisa que o pagamento ainda não acontece pelo app |
| Voltar | Telas internas usam botão redondo sobre a capa/foto, ou o gesto do sistema |

### 1.1 Identidade visual

| Token | Valor | Uso |
|---|---|---|
| Navy | `#132A45` | Texto, ícones, bordas, estado ativo, botão de busca |
| Navy escuro (produto) | `navy-700` | Texto e detalhes dentro da tela de produto (título, quantidade, opções) |
| Vermelho | `#D6293B` | **Só detalhes**: preço com desconto, botão primário, badges de urgência, contador do carrinho, bolinha de notificação, anéis e faixas de oferta |
| Superfície | `#FFFFFF` | Cartões e fundo |
| Superfície alternativa | `#F3F5F8` | Fundo cinza das áreas de listagem e telas de fluxo |
| Tipografia | Space Grotesk (títulos) + Inter (corpo) | |
| Raios | Cartões ~16 px; pílulas totalmente arredondadas | |

### 1.2 Barra superior (`.topbar`)
- Altura 60 px, fixa (sticky) no topo, com leve sombra na divisão com o conteúdo.
- Campo de busca sublinhado em navy: ícone de lupa + placeholder "Buscar na sua cidade".
- Divisor vertical e, à direita, pin de localização com **cidade** (ex.: "Blumenau") sobre o **estado** ("SC") em fonte menor.
- Toque no pin abre o pop-up de troca de cidade. Busca enviada abre `busca` com o termo.

### 1.3 Barra inferior (`.tabbar`)
Cinco itens, o ativo em navy e negrito:
1. **Início** → home
2. **Explorar** → busca
3. **Carrinho** → carrinho, com contador vermelho de itens
4. **Pedidos** → pedidos (alterna com reservas)
5. **Conta** → painel de conta, com bolinha vermelha quando há notificação

### 1.4 Componentes reutilizáveis

| Componente | Descrição |
|---|---|
| **Cartão de produto** (`pcard`) | Foto; badge de desconto (`-20%`, borda branca) quando houver; preço (azul/vermelho) + preço antigo; título; nome da loja e distância; nota e nº de avaliações; faixa de oferta quando houver; pílula inferior direita com **lupa** (abre produto) e **"+"** (abre "Adicionar a…"). Sem botão de favoritar |
| **Pop-up "Adicionar a…"** | Primeiro item **Carrinho** (com contagem e total), depois "Seus projetos" (nome, "x de y itens"), e "Novo projeto" |
| **Cartão de oferta** (`deal`) | Loja (anel vermelho de story), bairro, badge de urgência ("Termina em 2 dias"), "N produtos", título da campanha, trilho horizontal de até 10 produtos + "Ver mais" |
| **Slide do carrossel** (`promo`) | Foto de fundo, loja + bairro, badges de urgência e "N produtos", título "Campanha: X% em N itens" |
| **Cartão de projeto** (`proj`) | Foto 16:9, nome, "x de y itens", faixa vermelha "N itens em oferta" |
| **Linha de loja** (`store-row`) | Logo, nome, categoria, distância, nota, botão seguir "+" |
| **Abas** (`tabsw`/`utabs`) | Texto + sublinhado navy na ativa |
| **Chips de ordenação** | Mudam conforme a aba ativa (ver 3.1) |
| **Badge de status** | Em preparação (cinza claro), Entregue (navy cheio), urgência (vermelho) |
| **Botão primário** | Fundo vermelho, texto branco. Secundário: contorno navy |
| **Estrelas** | 1 a 5, preenchidas em navy/dourado conforme tela de avaliação |

---

## 2. Mapa de navegação

```
splash ─▶ login ◀─▶ cadastro
              │
              ▼
           index (Início) ◀──────────────────────────────┐
  ┌────────────┼──────────────┬───────────────┐           │
  ▼            ▼              ▼               ▼           │
busca       sede ◀──────▶ propaganda       produto        │
  │            │              │               │           │
  └────────────┴──────────────┴──▶ produto ◀──┘           │
                                     │   │   │            │
                  Comprar agora ─────┘   │   └─ Reservar ─▶ reservar ─▶ reserva ─▶ reservas
                         │               ▼
                         │          carrinho ──▶ checkout ◀─▶ endereco
                         │                          │
                         └──────────────────────────▼
                                              confirmacao ─▶ pedido ─▶ avaliacao
Barra inferior: Início · Explorar(busca) · Carrinho · Pedidos(pedidos ↔ reservas) · Conta(perfil)
```

---

## 3. Telas

### 3.1 Início — `index.html`
**Objetivo:** descobrir ofertas, projetos, produtos e lojas da cidade.
**Estrutura (de cima para baixo):**
1. Barra superior.
2. **Carrossel de ofertas** das lojas que o cliente segue — slides 16:9 com scroll-snap e bolinhas de posição (sincronizadas por `IntersectionObserver`). Cada slide: loja, bairro, badge de urgência, "N produtos", título da campanha. Toque abre `propaganda`. Último item: "Carregar mais".
3. **Seus projetos** — cabeçalho "Seus projetos / Ver todos"; trilho de cartões de projeto (ver 1.4) + cartão "+ Novo projeto — Junte o que precisa comprar".
4. **Abas Produtos | Ofertas | Lojas**, cada uma com:
   - contador ("6 produtos em Blumenau"), botão **Filtros** (com contagem de filtros ativos) e **chips de ordenação** específicos:
     - Produtos: Mais relevantes, Menor preço, Maior preço, Mais vendidos, Com desconto
     - Ofertas: Maior desconto, Termina antes, Mais recentes, Mais perto
     - Lojas: Mais perto, Melhor avaliadas, Mais ofertas, Abertas agora
   - Produtos: grade de cartões de produto. Ofertas: cartões de oferta. Lojas: linhas de loja.
   - Fundo cinza cobre ordenação e listas.
5. Barra inferior.

**Painéis embutidos:** pop-up de cidade (`#cidade`), painel de conta (`#conta`) com acesso a `perfil`, pop-up "Adicionar a…".
**Dados:** ofertas ativas das lojas seguidas; projetos do cliente (com contagem de itens comprados e em oferta); produtos/ofertas/lojas da cidade com ordenação e filtros no servidor; contagem do carrinho.
**Observação:** categorias aparecem como chips (pirâmide de 4 linhas rolando juntas, multisseleção; desmarcar todas volta a mostrar tudo).

### 3.2 Busca — `busca.html?q=termo`
**Objetivo:** resultados para o termo da barra superior (e tela do item Explorar).
- Mesmas três abas (Produtos | Ofertas | Lojas) em **pílula**, contador "N produtos para “termo”", botão Filtros ao lado direito e chips de ordenação por aba.
- As abas ficam **fixas** (sticky) ao rolar.
- Resultado sempre derivado do termo; no protótipo é mock fixo.
**Dados:** busca por texto (produto, loja, campanha) restrita à cidade escolhida.

### 3.3 Loja (sede) — `sede.html`
**Objetivo:** perfil de uma sede e seu catálogo.
- **Capa** de 230 px fixa (sticky) ao fundo; sobre ela desliza a **folha branca** com o conteúdo. Só a folha rola.
- Botão de voltar redondo sobre a capa. Sem barra inferior nem "ver carrinho": **botão redondo de Início** em vidro fosco (`backdrop-filter`) fixo no canto esquerdo inferior.
- Cabeçalho: logo com anel vermelho de oferta, nome, "Ver mais", nota e nº de avaliações, categoria, distância; botão seguir "+".
- Dados da sede: nome comercial, tipo (Sede Centro), selos **Entrega** e **Retirada**, status "Aberta até 20h", ronda ("próxima às 14h; uma ronda a cada 2 h, das 8h às 18h"), regra de retirada ("reserva vale 3 h") e endereço com distância.
- **Ofertas da loja** — título + "1 campanha nesta sede"; mostra o **mesmo cartão de oferta da Início** e, abaixo, o **mesmo carrossel** de slides de campanha.
- **Catálogo** por seções/categorias (Destaques, Áudio e vídeo, Celular, Periféricos e energia, Cabos e organização) com chips de navegação; itens com foto, nome, descrição curta, preço (regra azul/vermelho) e ação de adicionar.
- Horário de atendimento.
**Dados:** sede (endereço, horários, rondas, retirada), campanhas ativas, produtos por categoria, se o cliente segue.

### 3.4 Propaganda — `propaganda.html`
**Objetivo:** detalhe de uma campanha.
- Imagem da campanha com badges (`-20%`, "Termina em 2 dias").
- Título ("Semana da tecnologia"), resumo ("20% de desconto em 6 itens · até 31/08"), descrição e condição ("vale para entrega na próxima ronda e reserva com retirada").
- Cartão da loja anunciante: logo, nome, nota, categoria, bairro, distância, "Aberta até 20h", "Entrega em rondas".
- "Produtos da promoção — 6 itens com 20% de desconto": grade de cartões de produto.
- Pop-up "Adicionar a…" nos "+" dos cartões.
**Dados:** campanha (período, desconto, produtos incluídos), sede.

### 3.5 Produto — `produto.html`
**Objetivo:** detalhe de qualquer produto, no formato Mercado Livre. Cor de texto navy escuro, exceto barras e pop-ups (navy padrão).
Ordem dos blocos:
1. Barra superior.
2. **Cabeçalho do item:** nota (número + estrelas + nº de avaliações) e "+500 vendidos"; título.
3. **Galeria** (até 8+ fotos): scroll-snap horizontal; contador "n/8" (canto inferior, acima das miniaturas); botões flutuantes de **zoom** e **compartilhar**; **faixa de miniaturas** abaixo (70 px, miniatura de 56 px, ativa com borda navy e anel, inativas reduzidas; arrastável com o dedo e centraliza a ativa). **Zoom**: overlay em tela cheia com +, − e fechar, 4 níveis, com limite nas bordas.
4. **Variação** opcional (ex.: Cor: Preto/Branco/Azul), rótulo vem do produto; sem legenda visível.
5. **Preço:** valor antigo riscado, preço atual (vermelho com desconto), badge "20% OFF". **Faixa de campanha** vermelha clicável: "Semana da tecnologia · termina em 2 dias · Ver oferta ›" (leva à `propaganda`).
6. **Compra:** "Estoque disponível", **Quantidade** (stepper, "N disponíveis"), checkbox **Embalar para presente** (+ R$ 4,00 por item, quando a loja oferece), botões **Comprar agora · R$ …** (→ `checkout`), **Adicionar ao carrinho** (→ `carrinho`) e **Reservar para retirada** (→ `reservar`).
7. **Dois cartões de envio** (mesma altura, ícone em painel à esquerda): entrega ("Chega hoje às 14h, na próxima ronda" + "Mais detalhes e formas de entrega") e retirada ("Reserve e retire na loja — sem custo; fica separado por 3 h · Centro, a 800 m · Ver no mapa").
8. **Vendido por:** logo com anel, nome da loja, "Centro · Aberta até 20h", "★ 4,8 · +2 mil vendas", botão seguir "+" e **Compartilhar**.
9. **Descrição** (texto livre do lojista).
10. **Avaliações do produto** (`#avaliacoes`): média e estrelas, total, barras de distribuição 5→1, **filtro por estrelas** (Todas, 5★ … 1★), lista de avaliações (nota, texto, data relativa), botão **Ver mais avaliações** (tela de listagem ainda não prototipada).
11. **Mais produtos da loja:** trilho horizontal de cartões (sem botão "+"), link "Ver loja" (→ `sede`).
12. Barra inferior.
**Dados:** produto (título, descrição, fotos, variações, preço, preço promocional, estoque), campanha ativa, sede, regras de entrega/ronda e retirada, avaliações paginadas, métricas de venda.
**Removido de propósito:** seções "Características" e "O que você precisa saber".

### 3.6 Carrinho — `carrinho.html`
**Objetivo:** revisar itens de várias lojas antes de pedir.
- Itens **agrupados por loja** (cabeçalho: nome, bairro, "entrega na próxima ronda, às 14h").
- Linha de item: foto, nome, variação/medida, preço (regra azul/vermelho), stepper de quantidade e, para itens em oferta, **badge de prazo** ("Termina em 2 dias").
- Resumo: "Produtos sem desconto", "Descontos das ofertas" (valor negativo), **Total**.
- Botão **Continuar** (→ `checkout`) e link "Adicionar mais produtos" (→ início).
**Dados:** carrinho por cliente, agrupado por sede, com preços vigentes e prazo de cada oferta.

### 3.7 Finalizar pedido — `checkout.html`
**Objetivo:** confirmar endereço por loja e enviar o pedido.
- Subtítulo "N entregas, uma por loja".
- Um bloco por loja: itens (nome · qtd · valor), **endereço** (rótulo "Casa" + rua/bairro) com botão **Trocar** (→ `endereco`), "Próxima ronda: hoje às 14h" e a nota "A loja entrega pela ronda dela; o tipo de entrega é resolvido pelo sistema".
- Opção "Usar um endereço diferente para algum item".
- Resumo: Produtos, Presente (R$ 0,00 até haver itens marcados), Total, aviso "O pagamento ainda não acontece pelo app nesta versão".
- **Confirmar pedido** abre o pop-up **"Algum item é presente?"**: lista item a item (unidades iguais aparecem separadas), cada uma com "+ R$ 4,00"; lojas que não embrulham mostram "esta loja não embrulha para presente"; botões **Nenhum é presente** / **Confirmar pedido** (→ `confirmacao`).
**Dados:** endereços do cliente, ronda por sede, regras de presente por loja.

### 3.8 Endereço — `endereco.html`
- Lista de endereços salvos (rótulo, rua e número · bairro, selo "Em uso").
- Formulário "Novo endereço": CEP, Número, Rua, Complemento, Bairro, Cidade e rótulo do endereço (Casa / Trabalho / Outro); **Salvar endereço**.
- CEP deveria preencher rua/bairro/cidade automaticamente no app real.

### 3.9 Pedido enviado — `confirmacao.html`
- Ícone de sucesso, "Pedido enviado", "Pedido nº 4821. As lojas já receberam e vão preparar os itens."
- Um cartão por loja: nº de itens, ronda, status "Solicitação enviada".
- Nota: "Cada loja entrega a sua parte separado, no endereço escolhido."
- Ações: **Acompanhar pedido** (→ `pedido`), **Voltar ao início**.

### 3.10 Pedidos — `pedidos.html`
- Sem cabeçalho de página: abas **Pedidos | Reservas** logo abaixo da barra superior.
- Dois **cards separados**, cada um com título dentro:
  - **Em andamento** — pedidos ativos (foto do primeiro item, "Pedido nº", "Hoje · 4 itens de 2 lojas · R$ 376,50", badge "Em preparação", chevron).
  - **Entregues** — pedidos concluídos (data · itens · loja, badge "Entregue").
- Toque no pedido → `pedido`.

### 3.11 Detalhe do pedido — `pedido.html`
- Cabeçalho: nº, "Feito hoje às 11h20 · R$ 376,50".
- Bloco por loja: nome, ronda/endereço (ou "Entregue hoje às 10h40"), e por item a **linha de status**: Solicitação enviada → Em preparação → Aguardando ronda → Em rota de entrega → Entregue (o estado atual destacado).
- **Avaliar** quando entregue (→ `avaliacao`).
- Resumo: Produtos, Total.
**Observação:** o status é **por item**, não por pedido.

### 3.12 Reservar — `reservar.html`
- Item (foto, nome, variação, "N em estoque nesta loja", preço) com stepper.
- Cartão da loja: endereço, bairro, distância, "aberta até 20h".
- "Fica separado por **3 h** depois de confirmar. Cancele sem custo em até 1 h."
- Aviso: "Se não retirar no prazo, conta como falha — falhas seguidas suspendem suas reservas nesta empresa; depois de algumas, viram multa."
- **Confirmar reserva** (→ `reserva`).

### 3.13 Reservas — `reservas.html`
- Mesma estrutura de `pedidos`, aba **Reservas** ativa, com cards **Ativas** e **Encerradas**.

### 3.14 Reserva — `reserva.html`
- Loja e bairro, badge "Reservado", instrução "Mostre este código no balcão da loja", **código** (ex.: K7Q-4821) em destaque e prazo "Retire até hoje às 17h20".
- Item reservado (foto, nome, variação, qtd, preço).
- Dados da loja (endereço, horário) e link **Ver loja**.
- Aviso "Cancele sem custo até as 15h20. Depois disso, ou sem retirar, conta como falha."
- Ações: **Cancelar reserva** e **Já retirei · avaliar** (→ `avaliacao`).

### 3.15 Avaliação — `avaliacao.html`
- Contexto: "Pedido nº 4821 · Casa Firme".
- Três avaliações independentes por estrelas (1–5): **Loja**, **Produto** (por item) e **Motorista da ronda** (nome e inicial).
- Campo "Quer contar mais?" (texto livre) e **Enviar avaliação**.

### 3.16 Perfil — `perfil.html`
- Avatar com iniciais, nome, e-mail, CPF mascarado.
- Atalhos: **Meus pedidos**, **Minhas reservas** (com "1 ativa"), **Endereços** ("2 salvos"), **Lojas inscritas** ("5 lojas"), **Cidade** (Blumenau, SC), **Idioma** (Português).
- **Sair da conta**.

### 3.17 Splash / Login / Cadastro — `splash.html`, `login.html`, `cadastro.html`
**Sem barras superior/inferior** (cliente ainda não entrou).
- **Splash:** marca; avança sozinha para o login.
- **Login:** CPF + senha, link para criar conta, botão **Entrar** (→ Início).
- **Cadastro:** dados do cliente (nome, CPF, e-mail, senha, cidade), **Criar conta**, link de volta ao login.

---

## 4. Regras de negócio refletidas nas telas

- **Entrega por rondas:** cada loja entrega em horários fixos (ex.: a cada 2 h, 8h–18h); o cliente vê só a "próxima ronda". O tipo de entrega é decidido pelo sistema.
- **Um pedido, várias lojas:** o pedido se divide por loja; cada loja tem seu endereço, ronda e status. Status é por item.
- **Reserva para retirada:** sem custo; fica separada por N horas (3 h no exemplo); cancelamento gratuito dentro de uma janela (1 h); não retirar = **falha**; falhas seguidas suspendem reservas naquela empresa, depois viram multa.
- **Presente:** embalagem opcional **por unidade**, com valor próprio por loja; lojas podem não oferecer.
- **Ofertas/campanhas:** têm período, desconto, produtos vinculados e urgência ("Termina em N dias"/"Último dia"); itens em oferta mostram prazo no carrinho.
- **Projetos:** listas do cliente ("Computador novo", "Reforma da cozinha"…) com itens a comprar; mostram quantos já foram comprados e quantos estão em oferta. Todo produto pode ser adicionado ao **Carrinho** ou a um projeto.
- **Seguir loja:** gratuito; alimenta o carrossel de ofertas da Início.
- **Cidade:** o conteúdo é sempre da cidade escolhida (distâncias calculadas a partir do cliente).

## 5. Estados que o protótipo não cobre (a definir)

Carregando (skeleton), vazio (carrinho, pedidos, projetos, busca sem resultado), erro de rede, produto sem estoque / loja fechada, oferta encerrada, sessão expirada, notificações, tela "Ver mais avaliações", tela "Ver todos" de projetos, detalhe de projeto, filtros (conteúdo do sheet "Filtros"), lista de lojas seguidas, mapa, denúncia.

## 6. Pendências e pontos de decisão

1. Foto do produto "Pen drive" no protótipo mostra pilhas — trocar.
2. Favoritos foi removido do cartão de produto; confirmar se sai também do modelo/endpoints do backend.
3. Modelo de produto precisa suportar: categoria, marca, condição, múltiplas fotos e variações.
4. Pagamento: definir quando entra e como o checkout muda.
5. Projetos: definir escopo no backend (item referencia produto ou texto livre, marcação de "comprado").
6. O carrinho e o pop-up "Adicionar a…" nos cartões do trilho "Mais produtos da loja" (produto) não têm "+" por decisão de design; revisar com a equipe.

## 7. Arquivos do protótipo

| Arquivo | Conteúdo |
|---|---|
| `styles.css` | Tokens, reset, barras, cartões, pop-ups e componentes gerais |
| `home.css` | Carrossel, projetos, abas, ofertas, lista (Início) |
| `fluxo.css` | Telas de fluxo (carrinho, checkout, pedidos, reservas, avaliação, perfil, entrada, busca) |
| `sede.css`, `produto.css`, `propaganda.css` | Específicos de cada tela |
| `img/` | Fotos de exemplo (Unsplash): `produtos/`, `banners/`, `lojas/`, `projetos/` |
| `README.md` | Como rodar, regras visuais e limitações |
