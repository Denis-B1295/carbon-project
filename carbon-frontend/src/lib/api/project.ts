import { API_PROJECT_ROUTE } from "../const/project"
import { Portfolio } from "../types/entities/portfolio"
import { Project } from "../types/entities/project"
import { SearchQueryBody } from "../types/queries/searchQueryBody"


export const getAllProjects = async (): Promise<Project[]> => {
    return (await fetch(`${process.env.API_URL}/${API_PROJECT_ROUTE}/all`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })).json();
}

export const generatePortfolio = async (desiredVolume: number): Promise<Portfolio> => {
  return (await fetch(`${process.env.API_URL}/${API_PROJECT_ROUTE}/search`, {
    body: JSON.stringify({
      desiredVolume,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })).json();
}

export const search = async (searchQueryBody: SearchQueryBody): Promise<Portfolio> => {
  return (await fetch(`${process.env.API_URL}/${API_PROJECT_ROUTE}/search`, {
    body: JSON.stringify(searchQueryBody),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })).json();
}