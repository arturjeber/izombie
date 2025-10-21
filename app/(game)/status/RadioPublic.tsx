'use client';
import { BoxBase } from '@/components/boxbase';
import RadioLocal from '@/components/RadioLocal';

export default function RadioPublic() {
  return (
    <BoxBase superTitulo={'broadcast'} titulo="Public Radio">
      <RadioLocal estacao={'public'} />
    </BoxBase>
  );
}
