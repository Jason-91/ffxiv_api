import express from 'express';
import axios from 'axios';
import cors from 'cors';
const app = express();
const port = 8000;

// All key should exist in .env file
const xivApiPrivateKey = '77e71ea12ea143c7b0520295eb1cc31b0be74519e5924792917a4c191ae44fbc';

app.use(cors());

app.get('/search-itemname', async (req, res) => {
    const item_name = req.query.item_name;
    let result;

    await axios({
        method: 'get',
        url: `/search?indexes=item&string=${item_name}&sort_field=LevelItem&sort_order=desc&limit=100&private_keys=${xivApiPrivateKey}`,
        baseURL: `https://xivapi.com`
    })
    .then((value) => {
        // console.log('This is the value:', value);
        const { data } = value;
        const { Results } = data;
        // const Results = value.data.Results
        // console.log('These are the Results:', Results);
        result = {
            message: 'success',
            data: Results.map((data) => {
                return {
                    item_id: data.ID,
                    item_name: data.Name,
                    item_url: data.Url,
                    item_icon: data.Icon,
                }
            })
        }
    })
    .catch((error) => {
        result = { message: 'error: something terrible has happened!...' };
    });
    res.send(result);
});

// if not being used, remove
const dataCenter = 'Crystal'
// const world = 'Malboro'
// const allWorlds = ['Crystal', 'Balmung', 'Bryhildr', 'Coeurl', 'Diabolos', 'Goblin', 'Mateus', 'Malboro', 'Zalera']

app.get('/search-marketboard', async (req, res) => {
    // console.log('Queries:', req.query)
    const dataID = req.query['data-id'];
    // console.log(dataID);
    const dataCenter = req.query.dataCenter;
    // console.log(dataCenter);
    let result;
    let listingsResultsData;
    let listingsResults;
    let historyResultsData;
    let historyResults;

    await axios ({
        method: 'get',
        url: `/api/v2/${dataCenter}/${dataID}?listings=100`,
        baseURL: `https://universalis.app`
    })
    .then(async (value) => {
        // console.log('Listings value:', value);
        const { data } = value;
        // console.log('Listings value.data:', data);
        const { listings, averagePriceNQ, averagePriceHQ, currentAveragePriceNQ, currentAveragePriceHQ, nqSaleVelocity, hqSaleVelocity, minPriceNQ, maxPriceNQ, minPriceHQ, maxPriceHQ } = data;
        // listings = value.data.listings
        // averagePriceNQ = value.data.averagePriceNQ
        // console.log(listings);
        listingsResultsData = {
            averagePriceNQ,
            averagePriceHQ,
            currentAveragePriceNQ,
            currentAveragePriceHQ,
            nqSaleVelocity,
            hqSaleVelocity,
            minPriceNQ,
            maxPriceNQ,
            minPriceHQ,
            maxPriceHQ,
        };
        listingsResults = listings.map(element => {
            return {
                listings_lastReviewTime: element.lastReviewTime,
                listings_pricePerUnit: element.pricePerUnit,
                listings_quantity: element.quantity,
                listings_worldName: element.worldName,
                listings_hq: element.hq,
                listings_retainerName: element.retainerName,
                listings_total: element.total,
            };
        })

        await axios({
            method: 'get',
            url: `api/v2/history/${dataCenter}/${dataID}?entriesToReturn=100`,
            baseURL: `https://universalis.app`
        })
        .then((value) => {
            // console.log('History value:', value);
            const { data } = value;
            // console.log('History value.data:', data);
            const { entries, nqSaleVelocity, hqSaleVelocity } = data;
            // entries = value.data.entries
            // nqSaleVelocity = value.data.nqSaleVelocity
            // console.log(entries);
            historyResultsData = {
                nqSaleVelocity,
                hqSaleVelocity,
            };
            historyResults = entries.map(element => {
                return {
                    entries_hq: element.hq,
                    entries_pricePerUnit: element.pricePerUnit,
                    entries_quantity: element.quantity,
                    entries_buyerName: element.buyerName,
                    entries_timestamp: element.timestamp,
                    entries_worldName: element.worldName,
                }
            });
        });
    })
    .catch((error) => {
        result = { message: 'error: critical failure, critical miss, or fumble' }
    });
    // indentation
    result = {listingsResultsData,
    listingsResults,
    historyResultsData,
    historyResults,}
    res.send(result);
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});