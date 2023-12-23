drop database dbmarisa;
create database dbMarisa;

use dbMarisa;
CREATE TABLE Person (
  idPerson INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  motherLastName VARCHAR(50)NULL,
  dateRegister DATETIME NOT NULL
);


CREATE Table Suscriptor(
idSubcriptor  INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
Email varchar(50),
textArea varchar(255),
idPerson INT NOT NULL,
  FOREIGN KEY (idPerson) REFERENCES Person(idPerson) ON DELETE CASCADE
);


-- Tabla para la información de contacto de las personas
CREATE TABLE Contact (
  idContact INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  cell VARCHAR(15) NULL,
  city VARCHAR(20) NULL,
  address VARCHAR(100) NULL,
  idPerson INT NOT NULL,
  FOREIGN KEY (idPerson) REFERENCES Person(idPerson) ON DELETE CASCADE
);

-- Tabla para los usuarios
CREATE TABLE User (
  idUser INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  idPerson INT NOT NULL,
  FOREIGN KEY (idPerson) REFERENCES Person(idPerson) ON DELETE CASCADE
);

-- Tabla para los roles de los usuarios
CREATE TABLE Role (
  idRole INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  nameRole VARCHAR(20) NOT NULL DEFAULT 'Cliente',
  idUser INT NOT NULL,
  FOREIGN KEY (idUser) REFERENCES User(idUser) ON DELETE CASCADE
);



-- Tabla para los pedidos de los clientes
CREATE TABLE OrderCustomer (
  idOrder INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  state TINYINT NOT NULL DEFAULT 0, -- estado si esta vendio o no
   stateOrder  TINYINT NOT NULL default 0, -- si es para llevar o recoger
  dateOrderHour DATETIME,
  idPerson INT NOT NULL,
  FOREIGN KEY (idPerson) REFERENCES Person(idPerson) on delete cascade
);
CREATE TABLE Sales(
idSales INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
 saleDate DATETIME NOT NULL,
 idOrder INT NOT NULL, 
FOREIGN KEY (idOrder) REFERENCES OrderCustomer(idOrder) on delete cascade

);

-- Tabla para las categorías
CREATE TABLE Category (
  idCategory INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  nameCategory VARCHAR(50) unique not null,
 image VARCHAR(255) not null,
 imageId varchar(50)not null
);

-- Tabla para los productos
CREATE TABLE Product (
  idProduct INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  nameProduct VARCHAR(100) NOT NULL,
  description LONGTEXT NOT NULL,
  amount INT CHECK (amount >= 0),
  price DECIMAL(10, 2) NOT NULL,
  date DATETIME NOT NULL,
  color VARCHAR(20) NULL,
   size VARCHAR(10) NULL,
  outstanding TINYINT NOT NULL DEFAULT 0,
  idCategory INT NOT NULL,
  FOREIGN KEY (idCategory) REFERENCES Category(idCategory) ON DELETE CASCADE
);
CREATE TABLE ProductDate(
 idProductDate  INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
 imagenId varchar(50)not null,
image VARCHAR(255) NOT NULL,
  idProduct INT NOT NULL,
  FOREIGN KEY (idProduct) REFERENCES Product(idProduct) ON DELETE CASCADE
);



-- Tabla para los detalles de los productos en los pedidos
CREATE TABLE ProductDetail (
  idProductDetail INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  idProduct INT NOT NULL,
  idOrder INT NOT NULL,
	amount INT NOT NULL,
  total DECIMAL(10, 2),
  FOREIGN KEY (idOrder) REFERENCES OrderCustomer(idOrder) on delete cascade,
  FOREIGN KEY (idProduct) REFERENCES Product(idProduct) 
);
-- Tabla para la información de la empresa
CREATE TABLE InformationCompany (
  idInformationCompany INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  mission VARCHAR(255) NULL,
  vision VARCHAR(255) NULL
);




-- Trigger para actualizar el detalle de ventas
DELIMITER //

CREATE TRIGGER UpdateProductDetail AFTER INSERT ON ProductDetail
FOR EACH ROW
BEGIN
  DECLARE cantidad INT;
  DECLARE idProducto INT;
  DECLARE cantidadActual INT;
SET cantidad = NEW.amount;
SET idProducto = NEW.idProduct;

SELECT amount INTO cantidadActual
FROM Product
  WHERE idProduct = idProducto;

  IF cantidad > cantidadActual THEN
    SIGNAL  SQLSTATE '45000'
	SET MESSAGE_TEXT = 'La cantidad solicitada es mayor que la cantidad actual en la tabla Product.';
ELSE
UPDATE Product SET amount = amount - cantidad
WHERE idProduct = idProducto;
  END IF;
END //

DELIMITER ;



DELIMITER //

CREATE TRIGGER CalculateTotal BEFORE INSERT ON ProductDetail
FOR EACH ROW
BEGIN
    DECLARE productPrice DECIMAL(10, 2);
    SELECT price INTO productPrice FROM Product WHERE idProduct = NEW.idProduct;

    SET NEW.total = NEW.amount * productPrice;
END;
//

DELIMITER ;





DELIMITER //
CREATE TRIGGER PreventCategoryDeletion BEFORE DELETE ON Category -- verfica si la catrgoria tiene datos asociados
FOR EACH ROW
BEGIN
    DECLARE productCount INT;
    
    SELECT COUNT(*) INTO productCount
    FROM Product
    WHERE idCategory = OLD.idCategory;
    
    IF productCount > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede eliminar la categoría. Hay productos asociados a ella.';
    END IF;
END //
DELIMITER ;


#vistas
create view VerifyUser as select Person.idPerson,User.idUser,Person.firstName, Person.lastName,Person.motherLastName,User.email, User.password, Role.nameRole from Person inner join User on Person.idPerson=User.idPerson inner join Role on User.idUser=Role.idUser;
CREATE VIEW ViewsProduct AS
SELECT
    P.idProduct,
    P.nameProduct,
     P.size,
     P.outstanding,
    C.nameCategory,
    P.description,
    P.amount,
    P.price,
    P.color,
    (
        SELECT PD.image
        FROM ProductDate AS PD
        WHERE PD.idProduct = P.idProduct
        LIMIT 1
    ) AS image
FROM
    Product AS P
INNER JOIN
    Category AS C ON P.idCategory = C.idCategory;


CREATE VIEW Outstanding AS
SELECT
    P.idProduct,
    P.nameProduct,
    P.amount,
    P.color,
    P.price,
    (
        SELECT PD.image
        FROM ProductDate AS PD
        WHERE PD.idProduct = P.idProduct
        LIMIT 1
    ) AS image
FROM
    Product AS P
WHERE
    P.outstanding = 1;
 
#inserta los datos de la ventas y la hora  
DELIMITER //    
CREATE TRIGGER AfterUpdateState
AFTER UPDATE ON OrderCustomer
FOR EACH ROW
BEGIN
  IF NEW.state = 1 AND OLD.state != 1 THEN
    INSERT INTO Sales (saleDate, idOrder)
    VALUES (NOW(), NEW.idOrder);
  END IF;
END;
//

DELIMITER ;
    


create view CustomerOrder as 
 select Person.idPerson,
 Person.firstName,
  Person.lastname,
   Person.motherLastName,
OrderCustomer.idOrder,
OrderCustomer.state,
OrderCustomer.stateOrder,
   DATE_FORMAT(dateOrderHour, '%d/%b/%y') AS FechaCompleta,
    DATE_FORMAT(dateOrderHour, '%H:%i:%s') AS Hora,
Contact.Cell,
Contact.city,
Contact.address,
Product.nameProduct,
Product.size,
Product.color,
productDetail.amount,
productDetail.total
 from Person inner join OrderCustomer on Person.idPerson = OrderCustomer.idPerson 
 inner join Contact on Person.idPerson = Contact.idPerson
 inner join productDetail on OrderCustomer.idOrder = ProductDetail.idOrder
 inner join Product on ProductDetail.idProduct = Product.idProduct;
 

create view Suscriptos as select Person.idPerson, Person.firstName, Person.lastName, Person.MotherLastName ,Suscriptor.email, Suscriptor.textArea  from  Person  inner join Suscriptor on Person.idPerson=Suscriptor.idPerson;

 create view SalesProduct as select Person.idPerson, Person.firstName, Person.lastName, Person.motherLastname,  DATE_FORMAT(Sales.saleDate, '%d/%b/%y') AS FechaCompleta, DATE_FORMAT(Sales.saleDate, '%H:%i:%s') AS Hora, Product.nameProduct,Product.color,ProductDetail.amount, ProductDetail.total, Product.size    from Person inner join OrderCustomer on Person.idPerson = OrderCustomer.idPerson 
inner join Sales on OrderCustomer.idOrder = Sales.idOrder inner join ProductDetail on OrderCustomer.idOrder = ProductDetail.idOrder
inner join Product on ProductDetail.idProduct=Product.idProduct
 
