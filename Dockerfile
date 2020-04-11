FROM python:slim AS buildDocs
WORKDIR /app
COPY ./requirements.txt ./
COPY ./mkdocs.yml ./
COPY ./docs/. ./docs/
RUN pip install -r requirements.txt
RUN mkdocs build

FROM node:alpine
WORKDIR /app
COPY ./src/. ./src/
COPY --from=buildDocs /app/site/. ./src/static/
WORKDIR /app/src/server
RUN npm install
CMD ["npm", "run", "start"]
