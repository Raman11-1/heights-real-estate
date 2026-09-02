# 🏡 Heights Real Estate — House Price Prediction

An end-to-end machine learning application that predicts house prices from 13 property
and neighbourhood features. Built from scratch: data exploration and cleaning, feature
handling, model training and evaluation, then packaged behind a REST API and a
production web UI.

**Live demo:** _add your Vercel URL here_
**Live API:** https://real-estate-api-fgcc.onrender.com
· [`/docs`](https://real-estate-api-fgcc.onrender.com/docs) (interactive Swagger UI)

> The API is hosted on Render's free tier, so the first request after a period of
> inactivity can take ~30–60s while the instance cold-starts.

---

## Architecture

```
                  HTTPS / JSON
   ┌──────────────┐   POST /predict   ┌──────────────┐
   │   Next.js    │ ────────────────► │   FastAPI    │
   │   frontend   │                   │   backend    │
   │  (Vercel)    │ ◄──────────────── │  (Render)    │
   └──────────────┘   predicted_price └──────┬───────┘
                                             │ joblib.load
                                             ▼
                                    ┌──────────────────┐
                                    │ RandomForest     │
                                    │ Regressor (.pkl) │
                                    └──────────────────┘
```

| Layer    | Stack                                                   |
| -------- | ------------------------------------------------------- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind 4, Axios |
| Backend  | FastAPI, Uvicorn, Pydantic                              |
| ML       | scikit-learn `RandomForestRegressor` (100 trees), NumPy, pandas, joblib |
| Hosting  | Vercel (web) · Render (API)                             |

---

## Repository layout

```
heights-real-estate/
├── frontend/          Next.js app — prediction form and results UI
├── backend/           FastAPI service + serialized model
│   ├── main.py        API: /, /predict, /model-info
│   └── Height.joblib  Trained RandomForestRegressor
├── data/              Boston housing dataset (506 rows, 14 columns)
└── README.md
```

---

## The dataset

The Boston housing dataset — 506 records, 13 input features and one target.

| Feature   | Meaning                                              |
| --------- | ---------------------------------------------------- |
| `crim`    | Per-capita crime rate by town                         |
| `zn`      | % residential land zoned for lots over 25,000 sq ft   |
| `indus`   | % non-retail business acres per town                  |
| `chas`    | Bounds the Charles River (1) or not (0)               |
| `nox`     | Nitric oxide concentration (parts per 10 million)     |
| `rm`      | Average number of rooms per dwelling                  |
| `age`     | % owner-occupied units built before 1940              |
| `dis`     | Weighted distance to five employment centres          |
| `rad`     | Index of accessibility to radial highways             |
| `tax`     | Property tax rate per $10,000                         |
| `ptratio` | Pupil–teacher ratio by town                           |
| `b`       | 1000(Bk − 0.63)², where Bk is the proportion of Black residents |
| `lstat`   | % lower-status population                             |
| **`medv`**| **Target** — median home value, **in $1,000s**        |

`medv` is expressed in thousands of dollars (values range roughly 5–50, i.e.
$5,000–$50,000), which is why the API multiplies by 1,000 before formatting.

> **A note on `b`:** this feature encodes a racial demographic and is a well-documented
> ethical problem with the Boston housing dataset. It is retained here only to stay
> faithful to the original data; it should not be used in any real pricing system.

---

## Running locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API is then at `http://localhost:8000`, docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local      # then point it at your API
npm run dev
```

App is at `http://localhost:3000`.

---

## API reference

### `GET /`

Health check.

```json
{ "message": "Height Estate Price Prediction API", "status": "running", "model_loaded": true }
```

### `GET /model-info`

Reports the loaded model type and the feature order it expects.

### `POST /predict`

**Request**

```json
{
  "crim": 0.00632, "zn": 18.0, "indus": 2.31, "chas": 0,
  "nox": 0.538, "rm": 6.575, "age": 65.2, "dis": 4.09,
  "rad": 1, "tax": 296, "ptratio": 15.3, "b": 396.9, "lstat": 4.98
}
```

**Response**

```json
{
  "predicted_price": 26582.0,
  "predicted_price_medv": 26.582,
  "formatted_price": "$26,582.00"
}
```

`predicted_price` is in dollars. `predicted_price_medv` is the raw model output in
$1,000s, kept so the number can be compared directly against the `medv` column.

Try it:

```bash
curl -X POST https://real-estate-api-fgcc.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{"crim":0.00632,"zn":18.0,"indus":2.31,"chas":0,"nox":0.538,"rm":6.575,
       "age":65.2,"dis":4.09,"rad":1,"tax":296,"ptratio":15.3,"b":396.9,"lstat":4.98}'
```

---

## Deployment

**Backend (Render)** — new Web Service from this repo:

- Root directory: `backend`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Set `PYTHON_VERSION=3.12.7`

The Python version matters: `scikit-learn==1.6.1` ships prebuilt wheels only for
CPython 3.9–3.13. On 3.14 pip falls back to compiling from source and the build fails
without a C toolchain. `backend/.python-version` records the intended version.

**Frontend (Vercel)** — new project from this repo:

- Root directory: `frontend`
- Environment variable: `NEXT_PUBLIC_API_URL` → your Render URL

---

## Project history

This repository merges two originally separate repositories, with full commit
history preserved:

- [`Height-estate-frontend`](https://github.com/Raman11-1/Height-estate-frontend) → `frontend/`
- [`Height-estate-backend`](https://github.com/Raman11-1/Height-estate-backend) → `backend/`
