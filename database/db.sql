CREATE TABLE IF NOT EXISTS car (
    PlateNumber varchar(20) PRIMARY KEY, 
    CarType varchar(30), 
    CarSize varchar(20), 
    DriverName varchar(100),
    PhoneNumber int
);

CREATE TABLE IF NOT EXISTS package (
    PackageNumber int(11) PRIMARY KEY,
    PackageName varchar(50),
    PackageDescription 	varchar(150),
    PackagePrice decimal(10,2)
);
CREATE TABLE IF NOT EXISTS ServicePackage(
    RecordNumber int(11) PRIMARY KEY,
    ServiceDate DATE,
    PlateNumber varchar(20),
    PackageNumber int(11),
    FOREIGN KEY (PlateNumber) REFERENCES car (PlateNumber) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (PackageNumber) REFERENCES package(PackageNumber) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS Payment(
    PaymentNumber int PRIMARY KEY,
    AmountPaid decimal(10,2), 
    PaymentDate DATE,
    RecordNumber int,
    FOREIGN KEY (RecordNumber) REFERENCES ServicePackage(RecordNumber)
);