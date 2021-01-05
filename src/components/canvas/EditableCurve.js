import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import { editable as e } from 'react-three-editable'
import { useFrame, extend } from 'react-three-fiber'
import * as THREE from 'three'
import { MeshLine, MeshLineMaterial } from 'three.meshline'

extend({ MeshLine, MeshLineMaterial })

export const EditableCurve = forwardRef(({ size, uniqueName }, ref) => {
  const handles = useMemo(
    () => [...Array(size).keys()].map(() => new THREE.Mesh()),
    [size]
  )
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        handles.map((handle) => handle.position),
        true
      ),
    [handles]
  )

  const lineGeometryRef = useRef()
  console.log(curve)
  useFrame(() => {
    if (lineGeometryRef.current) {
      curve.updateArcLengths()
      const points = curve.getPoints(200)
      lineGeometryRef.current.setPoints(points)
    }
  })

  useImperativeHandle(ref, () => curve)

  return (
    <e.group uniqueName={uniqueName} visible={true}>
      {handles.map((handle, index) => (
        <e.primitive
          key={index}
          uniqueName={`${uniqueName} handle ${index}`}
          object={handle}
          editableType='mesh'
        >
          <sphereBufferGeometry />
          <meshBasicMaterial color='#064E3B' />
        </e.primitive>
      ))}
      <mesh>
        <meshLine attach='geometry' ref={lineGeometryRef} />
        <meshLineMaterial attach='material' color='#34D399' lineWidth={0.5} />
      </mesh>
    </e.group>
  )
})

EditableCurve.displayName = 'EditableCurve'
