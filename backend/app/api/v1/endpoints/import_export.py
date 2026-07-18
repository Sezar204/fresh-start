from fastapi import APIRouter, UploadFile, File, Response, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.utils.importer import DataImporter

router = APIRouter()

@router.get("/template/{entity}")
def download_template(entity: str):
    template_bytes = DataImporter.generate_template(entity)
    return Response(
        content=template_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={entity}_template.xlsx"}
    )

@router.post("/excel/{factory_id}/{entity}")
async def upload_excel(factory_id: int, entity: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = await file.read()
    res = DataImporter.parse_and_validate(entity, contents)
    return {"success": len(res["errors"]) == 0, "data": res, "message": f"Parsed {file.filename}"}
