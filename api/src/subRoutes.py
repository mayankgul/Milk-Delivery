from app import app
from sub import Subscription
from house import House
from misc import dateFromString
from schemas import NewSubParams, PauseSubParams
from fastapi import Depends, HTTPException
from utils import get_current_user
from db import connect, disconnect


# * inline with new schema
@app.post("/sub/new", summary="Create new subscription", status_code=201)
async def subscribe(params: NewSubParams, token_data=Depends(get_current_user)):
    con = connect()
    userid = token_data.get("userid")
    houseid = params.houseid
    milkids = params.milkids
    sub_start = dateFromString(params.sub_start)
    sub_end = dateFromString(params.sub_end)
    days = params.days

    house = House(houseid=houseid)
    await house.sync_details(con=con)
    sub = Subscription(
        house=house, milkids=milkids, sub_start=sub_start, sub_end=sub_end, days=days
    )

    details = await sub.activate(con=con)
    disconnect(con)
    return details


# * inline with new schema
@app.put("/sub/{subid}/pause", summary="Pause subscription", status_code=200)
async def pause_sub(
    subid: int, params: PauseSubParams, token_data=Depends(get_current_user)
):
    con = connect()
    userid = token_data.get("userid")
    pause_date = dateFromString(params.pause_date)
    resume_date = dateFromString(params.resume_date)

    sub = Subscription(subid=subid)
    await sub.sync_details(con=con)

    details = await sub.pause(pause_date, resume_date, con=con)
    disconnect(con)
    return details


# * inline with new schema
@app.delete("/sub/{subid}/end", summary="End subscription", status_code=204)
async def end_sub(subid: int, token_data=Depends(get_current_user)) -> None:
    con = connect()
    userid = token_data.get("userid")

    sub = Subscription(subid=subid)
    await sub.sync_details(con=con)

    cursor = con.cursor()

    query = f"SELECT * FROM bills WHERE houseid={sub.house.houseid} AND paid=0"
    cursor.execute(query)
    result = cursor.fetchall()
    details = [
        {
            "billid": row[0],
            "billGenTime": row[1],
            "billAmt": row[2],
            "paid": row[3],
            "subid": row[4],
            "houseid": row[5],
        }
        for row in result
    ]

    if len(details) == 0:
        disconnect(con)
        raise HTTPException(status_code=400, detail="There are pending bills")

    await sub.end(con=con)
    disconnect(con)
    return None
