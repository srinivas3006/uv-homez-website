export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, name, rating, text } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  if (!process.env.GITHUB_TOKEN) {
    return res.status(500).json({ error: 'Server misconfiguration: GITHUB_TOKEN missing' });
  }

  const owner = 'srinivas3006';
  const repo = 'uv-homez-website';
  const path = 'public/data.json';
  
  try {
    // 1. Get current data.json
    const getFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const getFileRes = await fetch(getFileUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!getFileRes.ok) throw new Error('Failed to fetch data.json from GitHub');
    
    const fileData = await getFileRes.json();
    const currentSha = fileData.sha;
    
    // Decode base64 content
    const decodedContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const siteData = JSON.parse(decodedContent);

    // 2. Append new testimonial
    const newId = siteData.testimonials.length > 0 
      ? Math.max(...siteData.testimonials.map(t => t.id)) + 1 
      : 1;

    siteData.testimonials.push({
      id: newId,
      name,
      text,
      rating
    });

    // 3. Commit back to GitHub
    const newContentBase64 = Buffer.from(JSON.stringify(siteData, null, 2)).toString('base64');

    const updateRes = await fetch(getFileUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Admin Panel: Add testimonial for ${name}`,
        content: newContentBase64,
        sha: currentSha,
        branch: 'main'
      })
    });

    if (!updateRes.ok) throw new Error('Failed to commit to GitHub');

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
