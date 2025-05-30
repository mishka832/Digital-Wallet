// utils/fraudDetection.js

const threshold = 1000000; // 10 lakh
const timeLimit = 2 * 60000; // 2 minutes in milliseconds

function fraudDetection(transactions) {
    const suspiciousTransactions = [];

    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    for (let i = 0; i < transactions.length; i++) {
        const tr = transactions[i];
        if (tr.amount > threshold) {
            let checkcount = 1;
            const date1 = new Date(tr.date);

            for (let j = i + 1; j < transactions.length; j++) {
                const date2 = new Date(transactions[j].date);
                const timeDiff = date2 - date1;

                if (timeDiff > timeLimit) break;

                if (transactions[j].amount > threshold) {
                    checkcount++;

                    if (checkcount >= 2) {
                        tr.flag = true;
                        transactions[j].flag = true;
                        suspiciousTransactions.push({
                            transaction1: tr,
                            transaction2: transactions[j],
                            timeDifferenceInMinutes: timeDiff / 60000
                        });
                    }
                }
            }
        }
    }

    return suspiciousTransactions;
}

module.exports = fraudDetection;
