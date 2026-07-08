# Firebase para contas reais

O site ja esta configurado para sincronizar conta, XP, progresso, evolucao e combos estudados pela nuvem.

Projeto Firebase criado:

```text
codigo-de-luta-premium
```

E-mail de suporte e liberacao:

```text
dyegocodigodeluta@gmail.com
```

## 1. Projeto Firebase

Projeto criado no Firebase Console com app Web `codigo-de-luta-premium`.

## 2. Ativar login

Authentication foi ativado com Email/Password.

## 3. Ativar banco

Firestore foi criado em Production mode, com as regras de `firebase/firestore.rules` publicadas.

## 4. Liberar e-mails

No Firestore, crie a colecao `approvedEmails`.

Quando alguem tenta criar conta sem liberacao, o site cria um pedido pendente em:

```text
accessRequests/EMAIL_DA_PESSOA
```

O pedido tambem tenta enviar um aviso para `dyegocodigodeluta@gmail.com`. Se o e-mail automatico falhar, use `accessRequests` como fonte confiavel.

Para liberar alguem, crie um documento com o ID igual ao e-mail em minusculo:

```text
approvedEmails/dyegocodigodeluta@gmail.com
```

Campos:

```json
{
  "approved": true
}
```

Repita para cada aluno liberado. Para bloquear alguem depois, remova o documento do e-mail ou altere `approved` para `false`.

## 5. Ativar o site

`public/firebase-config.json` ja esta com `enabled: true`. Depois de qualquer mudanca nesse arquivo, publique no GitHub Pages.

## Observacao importante

A API key do Firebase pode ficar no front-end. Ela nao e senha. A seguranca real esta nas regras do Firestore e na lista `approvedEmails`.
