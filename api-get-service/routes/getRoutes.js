const express = require("express");
const router = express.Router();

const calculateTimeElapsed = (dateString) => {
    if (!dateString) return { years: 0, months: 0, days: 0 };
    
    const [day, month, year] = dateString.split("/");
    const itemDate = new Date(year, month - 1, day);
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

router.get(`/${process.env.APP_NAME}/${process.env.ITEM_PLURAL}`, async (req, res) => {
    try {
        const response = await fetch(`http://localhost:${process.env.PORT_DB}/db/${process.env.ITEM_PLURAL}`);
        const data = await response.json();

        const processedData = data.map(item => {
            const [day, month, year] = item.date.split("/");
            return {
                ...item,
                addedAgo: calculateTimeElapsed(item.date),
                parsedDate: new Date(year, month - 1, day)
            };
        });

        processedData.sort((a, b) => b.parsedDate - a.parsedDate);

        const result = processedData.reduce(
            (acc, item) => {
                delete item.parsedDate;
                if (item.isActive) {
                    acc.active.push(item);
                } else {
                    acc.inactive.push(item);
                }
                return acc;
            },
            { active: [], inactive: [] }
        );

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
