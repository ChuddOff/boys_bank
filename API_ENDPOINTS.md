# Bank Backend API Contracts

Документ для синхронизации backend ↔ frontend и backend ↔ ML (антифрод сервис).

## 1) Endpoint'ы для связи с frontend

Все endpoint'ы банка защищены JWT (кроме `/api/auth/**`).

## Аутентификация

### `POST /api/auth/register`
Создание пользователя.

**Request (JSON):**
- `firstName: string`
- `lastName: string`
- `email: string`
- `password: string`

**Response:** данные пользователя/успех регистрации.

### `POST /api/auth/login`
Вход в систему.

**Request (JSON):**
- `email: string`
- `password: string`

**Response (JSON):**
- `token: string` — JWT для `Authorization: Bearer <token>`.

---

## Счета

### `POST /api/accounts`
Открыть счет (обычный/накопительный и т.д.).

**Request (JSON):**
- `type: "CURRENT" | "SAVINGS" | "DONATION"`
- `currency: string` (`"RUB"`, `"USD"`, `"EUR"` и т.п.)

**Response (JSON):**
- `id: number`
- `iban: string`
- `type: string`
- `balance: number`
- `currency: string`
- `active: boolean`

### `GET /api/accounts`
Получить все счета текущего пользователя.

**Response:** `AccountResponse[]`

### `POST /api/accounts/{accountId}/top-up`
Пополнить счет.

**Request (JSON):**
- `amount: number > 0`

**Response:** обновленный `AccountResponse`.

---

## Переводы/операции

### `POST /api/transactions/transfer`
Перевод между счетами. Поддерживает текст назначения платежа.

**Request (JSON):**
- `fromAccountId: number`
- `toIban: string`
- `amount: number > 0`
- `operationId: string` (уникальный idempotency ключ)
- `description: string | null` (назначение/комментарий платежа)

**Response (JSON):**
- `id: number`
- `fromAccountId: number`
- `toAccountId: number`
- `amount: number`
- `type: "TRANSFER" | ...`
- `operationId: string`
- `createdAt: datetime`
- `description: string | null`

### `GET /api/transactions/history`
История операций пользователя.

**Response:** `TransactionResponse[]`

---

## Вклады (сберегательные/накопительные сценарии)

### `POST /api/deposits`
Открыть вклад с указанной суммой и сроком.

**Request (JSON):**
- `sourceAccountId: number`
- `amount: number > 0`
- `annualRate: number` (например `0.14` для 14%)
- `termMonths: number` (1..120)

**Response (JSON):**
- `id`
- `accountId`
- `principal`
- `annualRate`
- `termMonths`
- `openedAt`
- `maturityDate`
- `projectedPayout`
- `active`

### `GET /api/deposits`
Список вкладов пользователя.

**Response:** `DepositResponse[]`

---

## Аналитика расходов

### `GET /api/analytics/monthly?year=YYYY&month=MM`
Статистика операций за конкретный месяц.

**Response (JSON):**
- `month: string` (формат `YYYY-MM`)
- `outgoingOperations: number`
- `outgoingTotal: number`
- `incomingOperations: number`
- `incomingTotal: number`

---

## Кредитный калькулятор

### `GET /api/credit/estimate?amount=...&months=...&annualRate=...`
Оценка кредита.

**Query params:**
- `amount: number > 0`
- `months: integer > 0`
- `annualRate: number` (optional, default `18.0`)

**Response (JSON):**
- `requestedAmount`
- `termMonths`
- `annualRate`
- `monthlyPayment`
- `totalPayment`
- `overpayment`

---

## Чат поддержки (заглушка)

### `POST /api/support/chat`
Имитация обращения в поддержку.

**Request (JSON):**
- `message: string`

**Response (JSON):**
- `status: "accepted"`
- `reply: string`

---

## Каталог endpoint'ов

### `GET /api/meta/endpoints`
Служебный endpoint: возвращает зарегистрированные endpoint'ы приложения.


## 2) Endpoint'ы для связи с языковой моделью / антифрод-моделью

В текущей реализации банк вызывает антифрод endpoint через `FraudGatewayService`.

### Внешний ML endpoint (который вызывает backend банка)

**URL (конфиг):** `fraud.api.url`  
**Default:** `http://localhost:8000/api/v1/check`

### Контракт запроса от bank-backend к ML

`POST {fraud.api.url}`

**Request (JSON):**
- `message: string` — текст назначения платежа (description)
- `amount: number`
- `currency: string`

### Ожидаемый ответ от ML

**Response (JSON):**
- `suspicious: boolean`
- `riskScore: number` (0..100)
- `reason: string`
- `source: string` (опционально, банк проставляет `ml-service` в своем ответе)

### Endpoint для frontend, чтобы проверить платеж через ML

`POST /api/fraud/check`

Frontend отправляет тот же payload:
- `message`
- `amount`
- `currency`

Backend:
1. Пытается запросить внешний ML.
2. Если ML недоступен, применяет локальную эвристику (ключевые слова + сумма).
3. Возвращает `FraudCheckResponse` во frontend.

