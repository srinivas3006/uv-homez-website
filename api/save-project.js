export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, category, title, sqft, beforeFilename, beforeContent, afterFilename, afterContent } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  if (!process.env.GITHUB_TOKEN) {
    return res.status(500).json({ error: 'Server misconfiguration: GITHUB_TOKEN missing' });
  }

  const owner = 'srinivas3006';
  const repo = 'uv-homez-website';
  
  try {
    const timestamp = Date.now();
    
    // Function to upload a single image to GitHub
    async function uploadToGitHub(filename, base64Content) {
      const cleanFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '');
      const uniqueFilename = `${timestamp}-${cleanFilename}`;
      const imagePath = `public/images/projects/${uniqueFilename}`;
      const imageUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${imagePath}`;

      const uploadRes = await fetch(imageUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Admin Panel: Upload image ${uniqueFilename}`,
          content: base64Content,
          branch: 'main'
        })
      });

      if (!uploadRes.ok) throw new Error(`Failed to upload ${filename}`);
      return `/images/projects/${uniqueFilename}`;
    }

    // 1. Upload both images
    const beforeImagePath = await uploadToGitHub(beforeFilename, beforeContent);
    const afterImagePath = await uploadToGitHub(afterFilename, afterContent);

    // 2. Update data.json with the new project
    const dataPath = 'public/data.json';
    const dataUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${dataPath}`;
    
    const getDataRes = await fetch(dataUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!getDataRes.ok) throw new Error('Failed to fetch data.json');
    
    const fileData = await getDataRes.json();
    const currentSha = fileData.sha;
    
    const decodedContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const siteData = JSON.parse(decodedContent);

    const newId = siteData.projects.length > 0 
      ? Math.max(...siteData.projects.map(p => p.id)) + 1 
      : 1;

    siteData.projects.push({
      id: newId,
      category,
      title,
      sqft: sqft || '',
      beforeImage: beforeImagePath,
      afterImage: afterImagePath
    });

    // 3. Commit data.json back to GitHub
    const newContentBase64 = Buffer.from(JSON.stringify(siteData, null, 2)).toString('base64');

    const updateDataRes = await fetch(dataUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Admin Panel: Add project ${title}`,
        content: newContentBase64,
        sha: currentSha,
        branch: 'main'
      })
    });

    if (!updateDataRes.ok) throw new Error('Failed to update data.json on GitHub');

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
