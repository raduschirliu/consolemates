# Backend

## Setting up virtual environment

Run the following:

```shell
python -m virtualenv .venv
source ./venv/Scripts/activate
pip install -r requirements.txt
```

## Running

To define environment variables, create a file called `.env` in this directory. Add any environment variables here:

```
DATABASE_URL=some/url/
JWT_SECRET=1234fdafasdf
```

Then, run the app locally from this directory with

```sh
flask run
```