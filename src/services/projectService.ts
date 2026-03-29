const username = "mtcodes01";
const CACHE_KEY = "portfolio_projects_data";

export interface ProjectData {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  languages_url: string;
  topics: string[];
}

export const projectService = {
  async fetchProjects(forceRefresh = false): Promise<ProjectData[]> {
    if (!forceRefresh) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          console.error("Failed to parse cached projects", e);
        }
      }
    }

    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=100`, {
        headers: { "Accept": "application/vnd.github.v3+json" }
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      const filtered = data.filter((repo: any) => 
        repo.topics && repo.topics.some((t: string) => t.toLowerCase() === 'portfolio')
      );

      localStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
      return filtered;
    } catch (error) {
      console.error("Failed to fetch repositories:", error);
      // If fetch fails, try to return cache even if forceRefresh was true
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) return JSON.parse(cached);
      throw error;
    }
  },

  getCachedProjects(): ProjectData[] | null {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};
