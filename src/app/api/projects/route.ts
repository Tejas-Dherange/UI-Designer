import { NextApiRequest, NextApiResponse } from 'next';

// Mock database (replace with your actual database logic)
let projectsDatabase: { [key: string]: any } = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'PUT':
      // Handle saving project data
      const { projectId, content } = req.body;

      if (!projectId || !content) {
        return res.status(400).json({ message: 'Project ID and content are required.' });
      }

      // Save the project data (mock implementation)
      projectsDatabase[projectId] = content;

      return res.status(200).json({ message: 'Project saved successfully.' });

    case 'GET':
      // Handle fetching project data
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Project ID is required.' });
      }

      const project = projectsDatabase[id];

      if (!project) {
        return res.status(404).json({ message: 'Project not found.' });
      }

      return res.status(200).json({ project });

    default:
      res.setHeader('Allow', ['PUT', 'GET']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}