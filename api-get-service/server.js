require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 2008;
const DB_URL = `http://localhost:5008/db/${process.env.ITEM_PLURAL}`;

app.use(cors());
app.use(express.json());

const calculateTimeElapsed = (dateString) => {
    if (!dateString) return { years: 0, months: 0, days: 0 };
    
    const itemDate = new Date(dateString);
    const currentDate = new Date();

    let years = currentDate.getFullYear() - itemDate.getFullYear();
    let months = currentDate.getMonth() - itemDate.getMonth();
    let days = currentDate.getDate() - itemDate.getDate();

    if (days < 0) {
        months -= 1;
        const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        days += previousMonth.getDate();
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { years, months, days };
};

app.get(`/${process.env.APP_NAME}/${process.env.ITEM_PLURAL}`, async (req, res) => {
    try {
        const response = await fetch(DB_URL);
        const data = await response.json();

        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));

        const result = {
            active: [],
            inactive: []
        };

        sortedData.forEach(item => {
            const processedItem = {
                ...item,
                addedAgo: calculateTimeElapsed(item.date)
            };

            if (processedItem.isActive) {
                result.active.push(processedItem);
            } else {
                result.inactive.push(processedItem);
            }
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT);
