from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.package import Package
from app.models.product import Product
from app.models.service import Service
from app.schemas.package import PackageOut

router = APIRouter()


def _package_to_out(package: Package, services_by_id: dict, products_by_id: dict) -> PackageOut:
    return PackageOut(
        id=package.id,
        slug=package.slug,
        name=package.name,
        description=package.description,
        image_url=package.image_url,
        price=package.price,
        service_names=[
            services_by_id[row.service_id] for row in package.services if row.service_id in services_by_id
        ],
        product_names=[
            products_by_id[row.product_id] for row in package.products if row.product_id in products_by_id
        ],
        service_ids=[row.service_id for row in package.services],
        product_ids=[row.product_id for row in package.products],
    )


@router.get("/", response_model=list[PackageOut])
def list_packages(db: Session = Depends(get_db)) -> list[PackageOut]:
    packages = db.query(Package).order_by(Package.price.asc()).all()
    services_by_id = {row.id: row.name for row in db.query(Service).all()}
    products_by_id = {row.id: row.name for row in db.query(Product).all()}

    return [_package_to_out(package, services_by_id, products_by_id) for package in packages]
