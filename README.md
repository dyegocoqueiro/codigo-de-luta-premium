# Codigo de Luta Premium

Site do Codigo de Luta preparado para publicacao no GitHub Pages.

## Rodar localmente

```bash
npm install --legacy-peer-deps
npm run dev
```

## Publicar no GitHub Pages

O workflow em `.github/workflows/deploy.yml` publica automaticamente quando houver push na branch `main`.

## Liberar novos cadastros

Edite `public/approved-emails.json` e adicione o e-mail da pessoa na lista `allowed`. Sem estar nessa lista, a pessoa nao consegue criar conta nova.

## Contas entre aparelhos

O GitHub Pages hospeda apenas arquivos estaticos, entao ele nao tem banco de dados proprio. Para a mesma conta salvar progresso em celular, PC, notebook e tablet, conecte um backend como Firebase, Supabase ou Google Apps Script.
