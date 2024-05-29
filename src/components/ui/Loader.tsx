import { BeatLoader } from 'react-spinners';
import { useRequest } from '../../context/useRequestHook';

export const Loader = () => {
  const { loading } = useRequest();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <BeatLoader color="#10abbb" />
    </div>
  );
};
