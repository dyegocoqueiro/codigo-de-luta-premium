# Firebase para contas reais

O site ja esta preparado para sincronizar conta, XP, progresso, evolucao e combos estudados pela nuvem. Para ativar, configure um projeto Firebase na conta `dyegocodigodeluta@gmail.com`.

## 1. Criar projeto

1. Acesse https://console.firebase.google.com/
2. Crie um projeto para o Codigo de Luta.
3. Adicione um app Web e copie a configuracao.

## 2. Ativar login

1. No Firebase, abra Authentication.
2. Em Sign-in method, ative Email/Password.

## 3. Ativar banco

1. Abra Firestore Database.
2. Crie o banco em Production mode.
3. Em Rules, cole o conteudo de `firebase/firestore.rules` e publique.

## 4. Liberar e-mails

No Firestore, crie a colecao `approvedEmails`.

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

Repita para cada aluno liberado.

## 5. Ativar o site

Edite `public/firebase-config.json`, coloque `enabled: true` e preencha com a configuracao do seu app Web Firebase:

```json
{
  "enabled": true,
  "apiKey": "SUA_API_KEY",
  "authDomain": "SEU_PROJETO.firebaseapp.com",
  "projectId": "SEU_PROJETO",
  "storageBucket": "SEU_PROJETO.appspot.com",
  "messagingSenderId": "000000000000",
  "appId": "1:000000000000:web:xxxxxxxx"
}
```

Depois publique no GitHub Pages.

## Observacao importante

A API key do Firebase pode ficar no front-end. Ela nao e senha. A seguranca real esta nas regras do Firestore e na lista `approvedEmails`.
