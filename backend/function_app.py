import os
import json
from azure.data.tables import TableClient
from azure.core.exceptions import ResourceNotFoundError
import azure.functions as func
import logging

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="VisitorsHttpsTrigger")
def VisitorsHttpsTrigger(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
          count = increment_and_get_count()
          return func.HttpResponse(json.dumps({"count": count}), mimetype="application/json", status_code=200)
        except Exception:
          logging.exception("Failed to update/read visitor count")
          return func.HttpResponse(json.dumps({"error": "internal_error"}), mimetype="application/json", status_code=500)


    if name:
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )



COSMOS_CONN = os.getenv("COSMOS_TABLE_CONN_STR")
TABLE_NAME = os.getenv("COSMOS_TABLE_NAME", "VisitorCount")
PK = os.getenv("COSMOS_PARTITION_KEY", "counter")
RK = os.getenv("COSMOS_ROW_KEY", "global")


def increment_and_get_count() -> int:
    table_client = TableClient.from_connection_string(conn_str=COSMOS_CONN, table_name=TABLE_NAME)
    try:
        entity = table_client.get_entity(partition_key=PK, row_key=RK)
    except ResourceNotFoundError:
        entity = {"PartitionKey": PK, "RowKey": RK, "count": 0}
        table_client.upsert_entity(entity=entity)
        entity = table_client.get_entity(partition_key=PK, row_key=RK)

    new_count = int(entity.get("count", 0)) + 1
    entity["count"] = new_count
    table_client.upsert_entity(entity=entity)
    return new_count