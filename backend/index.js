const express = require('express');
const db = require('./config/db');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(cors({
    origin: 'http://localhost:5173',
}))

app.use(express.json());

app.post("/car", (req,res) => {
    const { PlateNumber,CarType, CarSize,DriverName,PhoneNumber } = req.body;
    if(!PlateNumber || !CarType ||!CarSize || !DriverName ||!PhoneNumber ) {
        return res.status(400).json({message: "All fields are required"});
    }
    const sql = `INSERT INTO car (PlateNumber,CarType, CarSize,DriverName,PhoneNumber ) VALUES (?,?,?,?,?)`;

    db.query(sql,
        [PlateNumber,CarType, CarSize,DriverName,PhoneNumber],
        (err,result) => {
            if(err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Car already exists'});
                }
                return res.status(500).json({ error: err.message});
            }
            res.status(201).json({
                message:"car added",
                id:result.insertId
            });
        }
    )
});
app.get("/car", (req,res) => {
    db.query("SELECT * FROM car", (err,results) => {
        if (err) {
            return res.status(500).json({ error:err.message});
        }
        res.json(results);
    });
});
app.put("/car/:PlateNumber", (req,res) => {
    const { PlateNumber } = req.params;
    const { CarType, CarSize,DriverName,PhoneNumber } = req.body;

    const sql = `UPDATE car SET CarType = ? , CarSize = ?, DriverName = ? ,PhoneNumber = ? WHERE PlateNumber = ?`;
    db.query(sql,
        [CarType, CarSize,DriverName,PhoneNumber,PlateNumber],
        (err,result) => {
            if (err) {
                return res.status(500).json ({error: err.message});
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({message:"Car not found"});
            }
            res.json({ message: "Car updated"});
        }
    );
});
app.delete("/car/:PlateNumber", (req,res) => {
    const { PlateNumber } = req.params;
    db.query("DELETE FROM car WHERE PlateNumber = ? ", [PlateNumber], (err,result) => {
        if(err) {
            return res.status(500).json ({ error: err.message});
        }
        if(result.affectedRows === 0) {
            return res.status(404).json ({ message:"Car not found"});
        }
        res.json({ message:"Car deleted successfully"});
    });
});

app.listen(port,() => {
    console.log(`server us running on http://localhost:${port}`);
});