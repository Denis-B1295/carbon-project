import { getAllProjects } from '@/lib/api/project';

export default async function Page() {

    const projects = await getAllProjects()

    return (
        <div>
            <table className='border-spacing-2 border-separate'>
                <thead>
                    <tr>
                        <th key={'header-name'}>Name</th>
                        <th key={'header-distr'}>Distribution weight</th>
                        <th key={'header-volume'}>Offered Volume (tonns)</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(project => (
                        <tr key={`project-${project.id}`}>
                            <td key={`project-name-${project.id}`}>
                                <span>
                                    {project.name}
                                </span>
                            </td>
                            <td key={`project-distr-${project.id}`}>
                                <span>
                                    {project.distributionWeight}
                                </span>
                            </td>
                            <td key={`project-volume-${project.id}`}>
                                <span>
                                    {project.offeredVolumeInTons}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
