import express from 'express';
import axios from 'axios';
import cors from 'cors';
const app = express();
const port = 8000;

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
        const { data } = value;
        const { Results } = data;
        // const Results = value.data.Results
        // console.log(Results);
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

const dataCenter = 'Crystal'
// const world = 'Malboro'
// const allWorlds = ['Crystal', 'Balmung', 'Bryhildr', 'Coeurl', 'Diabolos', 'Goblin', 'Mateus', 'Malboro', 'Zalera']

app.get('/search-marketboard', async (req, res) => {
    const data_ID = req.query.dataID;
    let result;

    await axios ({
        method: 'get',
        url: `/api/v2/${dataCenter}/${data_ID}`,
        baseURL: `https://universalis.app`
    })

    .then(async (value) => {
        const { data } = value;
        const { listings } = data;
        // listings = value.data.listings
        // console.log(listings);
        let listingsResults = [];

        listingsResults = listings.map(element => {
            return {
                listings_lastReviewTime: element.lastReviewTime,
                listings_pricePerUnit: element.pricePerUnit,
                listings_quantity: element.quantity,
                listings_worldName: element.worldName,
                listings_hq: element.hq,
                listings_retainerName: element.retainerName,
                listings_total: element.total,
            }
        })

        await axios({
            method: 'get',
            url: `api/v2/history/${dataCenter}/${data_ID}?entriesToReturn=100`,
            baseURL: `https://universalis.app`
        })

        .then((value) => {
            const { data } = value;
            const { entries } = data;
            // entries = value.data.entries
            // console.log(entries);
            let entriesResults = [];

            entriesResults = entries.map(element => {
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

    res.send(result);
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});