from utils.db_module import db

class ProductModel(db.Model):
    __abstract__ = True
    __bind_key__ = 'products'

class Product(ProductModel):
    __tablename__ = 'product'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_type = db.Column(db.Text, nullable=False)
    model_name = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.LargeBinary)