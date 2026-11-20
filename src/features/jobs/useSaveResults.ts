import { useDownloadResults } from '../../api'
import { saveBlob } from '../../lib/saveBlob'

export const useSaveResults = () => {
  const download = useDownloadResults()

  const save = (jobId: number) =>
    download.mutate(jobId, {
      onSuccess: (blob) => saveBlob(blob, `job-${jobId}-results.csv`),
    })

  return { save, isSaving: download.isPending, error: download.error }
}
