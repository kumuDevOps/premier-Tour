const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const photos = [
  { key: 'about', name: 'About Us', pageUrl: 'https://unsplash.com/photos/team-members-gripping-wrists-in-unity-gesture-Y5bvRlcCx8k', id: 'Y5bvRlcCx8k' },
  { key: 'blog', name: 'Blog', pageUrl: 'https://unsplash.com/photos/an-aerial-view-of-a-beach-with-rocks-and-water-MJhECpYETyg', id: 'MJhECpYETyg' },
  { key: 'home', name: 'Home', pageUrl: 'https://unsplash.com/photos/a-beach-with-a-palm-tree-and-chairs-on-it-F-URY4TcXNI', id: 'F-URY4TcXNI' },
  { key: 'tours', name: 'Tours', pageUrl: 'https://unsplash.com/photos/blue-train-on-nine-arches-bridge-jpTT_SAU034', id: 'jpTT_SAU034' },
  { key: 'hotels', name: 'Hotels', pageUrl: 'https://unsplash.com/photos/a-resort-is-bathed-in-the-warmth-of-sunset-srZtj-Iq7dw', id: 'srZtj-Iq7dw' },
  { key: 'flights', name: 'Flights', pageUrl: 'https://unsplash.com/photos/aerial-photography-of-airliner-rf6ywHVkrlY', id: 'rf6ywHVkrlY' },
  { key: 'cars', name: 'Cars', pageUrl: 'https://unsplash.com/photos/yellow-taxi-cab-on-street-during-daytime-lopl80HjSPs', id: 'lopl80HjSPs' },
  { key: 'contact', name: 'Contact Us', pageUrl: 'https://unsplash.com/photos/a-wooden-table-topped-with-scrabble-tiles-spelling-contact-48CkLuEGgWU', id: '48CkLuEGgWU' },
  { key: 'beachRestaurant', name: 'Beach Restaurant', pageUrl: 'https://unsplash.com/photos/a-beach-restaurant-boasts-beautiful-views-and-a-flag-A--IPf3R6_E', id: 'A--IPf3R6_E' }
];

function fetchViaJina(url) {
  return new Promise((resolve, reject) => {
    const jinaUrl = `https://r.jina.ai/${url}`;
    https.get(jinaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

function testAndDownload(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode}`));
      }
      const cType = res.headers['content-type'] || '';
      if (!cType.startsWith('image/')) {
        return reject(new Error(`Invalid content type: ${cType}`));
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          const stats = fs.statSync(destPath);
          resolve({ size: stats.size, contentType: cType });
        });
      });
    }).on('error', reject);
  });
}

async function main() {
  const bannersDir = path.join(__dirname, '..', 'public', 'assets', 'banners');
  if (!fs.existsSync(bannersDir)) {
    fs.mkdirSync(bannersDir, { recursive: true });
  }

  const results = {};

  for (const item of photos) {
    console.log(`\n========================================`);
    console.log(`Resolving: ${item.name} (${item.key})`);
    console.log(`Source Page: ${item.pageUrl}`);

    try {
      const res = await fetchViaJina(item.pageUrl);
      console.log(`Jina status: ${res.statusCode}`);

      // Look for the main photo URL
      // In Jina markdown: ![Image 2: ...](https://images.unsplash.com/photo-...)
      const matches = res.data.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-_]+/g) || [];
      console.log(`Found photo URLs (${matches.length}):`, matches.slice(0, 3));

      let photoBase = matches[0];
      if (!photoBase) {
        throw new Error('No photo URL found in page');
      }

      const cdnUrl = `${photoBase}?auto=format&fit=crop&w=1920&q=80`;
      const localFilename = `${item.key}-banner.webp`;
      const localFilePath = path.join(bannersDir, localFilename);

      console.log(`Testing and downloading: ${cdnUrl}`);
      const downloadInfo = await testAndDownload(cdnUrl, localFilePath);

      console.log(`Success! File size: ${downloadInfo.size} bytes (${downloadInfo.contentType})`);

      results[item.key] = {
        name: item.name,
        sourcePage: item.pageUrl,
        cdnBase: photoBase,
        cdnUrl: cdnUrl,
        localUrl: `/assets/banners/${localFilename}`,
        size: downloadInfo.size,
        contentType: downloadInfo.contentType
      };
    } catch (e) {
      console.error(`FAILED for ${item.key}:`, e.message);
    }
  }

  console.log('\n\n========================================');
  console.log('Final Banner Resolution Summary:');
  console.log(JSON.stringify(results, null, 2));

  fs.writeFileSync(
    path.join(__dirname, '..', 'banner-resolution.json'),
    JSON.stringify(results, null, 2)
  );
}

main().catch(console.error);
