from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.branch import Branch
from app.models.product import Product
from app.models.service import Service


def seed_initial_data(db: Session) -> None:
    if db.query(Branch).count() == 0:
        db.add(
            Branch(
                name="GLOSSIA Centre Ville",
                address="Bd Mohammed V, Casablanca",
            )
        )

    if db.query(Service).count() == 0:
        db.add_all(
            [
                Service(
                    slug="haircut",
                    name="حلاقة",
                    description="حلاقة احترافية مع تنظيف دقيق",
                    price=Decimal("90.00"),
                    duration_minutes=40,
                    image_url="/images/placeholders/haircut.jpg",
                ),
                Service(
                    slug="beard",
                    name="لحية",
                    description="تشذيب اللحية وتحديدها",
                    price=Decimal("60.00"),
                    duration_minutes=30,
                    image_url="/images/placeholders/beard.jpg",
                ),
                Service(
                    slug="full-package",
                    name="باقة كاملة",
                    description="حلاقة + لحية + عناية سريعة",
                    price=Decimal("150.00"),
                    duration_minutes=70,
                    image_url="/images/placeholders/full.jpg",
                ),
            ]
        )

    if db.query(Product).count() == 0:
        db.add_all(
            [
                Product(
                    slug="biotin-gummies",
                    name="علكات البيوتين",
                    short_description="تقوية الشعر وتقليل التساقط",
                    long_description="صيغة يومية مريحة لدعم بصيلات الشعر.",
                    image_url="/images/placeholders/biotin.jpg",
                    category="hair-care",
                    price_1=Decimal("199.00"),
                    price_2=Decimal("279.00"),
                    price_3=Decimal("349.00"),
                    stock=22,
                    rating=4.8,
                    review_count=312,
                ),
                Product(
                    slug="beard-oil",
                    name="زيت اللحية",
                    short_description="ترطيب وتكثيف مظهر اللحية",
                    long_description="خليط زيوت طبيعية للترطيب اليومي.",
                    image_url="/images/placeholders/beard-oil.jpg",
                    category="beard-care",
                    price_1=Decimal("119.00"),
                    price_2=Decimal("199.00"),
                    price_3=Decimal("269.00"),
                    stock=18,
                    rating=4.7,
                    review_count=205,
                ),
                Product(
                    slug="matte-clay",
                    name="Matte Styling Clay",
                    short_description="تثبيت قوي بدون لمعان",
                    long_description="مثالي لتسريحات يومية بثبات طويل.",
                    image_url="/images/placeholders/clay.jpg",
                    category="hair-care",
                    price_1=Decimal("149.00"),
                    price_2=Decimal("229.00"),
                    price_3=Decimal("299.00"),
                    stock=30,
                    rating=4.9,
                    review_count=188,
                ),
            ]
        )

    db.commit()
