import {useSetValueCallback, useValue} from '../ui-react/index.ts';
import {OPEN_VALUE, POSITION_VALUE, TITLE} from './common.ts';
import type {StoreProp} from './types.ts';

export const Nub = ({s}: StoreProp) => {
  const position = useValue(POSITION_VALUE, s) ?? 1;
  const handleOpen = useSetValueCallback(OPEN_VALUE, () => true, [], s);

  return useValue(OPEN_VALUE, s) ? null : (
    <img onClick={handleOpen} title={TITLE} data-position={position} />
  );
};
