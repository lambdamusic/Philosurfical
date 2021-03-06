(in-package #:ocml)

(defun ocml-warn (string &rest format-args)
  (apply #'warn string format-args))

(defun ocml-output (string &rest format-args)
  (apply #'format t  string format-args))

(defun get-source-pathname (dspec)
  #+:lispworks-dspec
  (cadar (dspec:find-dspec-locations dspec)))

(defun ocml-record-source-file (name type &optional ontology)
  #+:sbcl (declare (ignore name type))
  (when (and (null ontology)
             *ocml-initialized*)
    (setf ontology (name *current-ontology*)))
  #+:mcl (CCL:RECORD-SOURCE-FILE name type)
  #+(and :lispworks (not :lispworks-dspec))
  (eval `(lw::top-level-form (,type ,name ,ontology) nil))
  #+:lispworks-dspec
  (lispworks:record-definition (list type name ontology)
			       (lispworks::current-pathname)
			       :check-redefinition-p nil)
  #+:allegro(cl-user::record-source-file name :type type))

(defun ocml-record-instance-source-file (name parent type &optional ontology)
  #+:sbcl (declare (ignore name parent type))
  (when (and (null ontology)
             *ocml-initialized*)
    (setf ontology (name *current-ontology*)))
  #+:mcl (CCL:RECORD-SOURCE-FILE name type)
  #+(and :lispworks (not :lispworks-dspec))
  (eval `(lw::top-level-form (,type ,name ,parent ,ontology) nil))
  #+:lispworks-dspec
  (lispworks:record-definition (list type name parent ontology)
			       (lispworks::current-pathname)
			       :check-redefinition-p nil)
  #+:allegro(cl-user::record-source-file name :type type))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
 #+:lispworks(eval-when (eval load)
               ;;;;;;;;;;(editor::setup-indent 'def-role 1 4 4)
               (editor::setup-indent 'def-rule 1 4 4))

#+:lispworks-dspec
(dspec:define-dspec-class def-class nil "OCML Def-class"
  :pretty-name "Def-class"
  :canonicalize #'(lambda (dspec)
		    (let ((name (cadr dspec))
                          (ontology (third dspec)))
                      `(def-class ,name ,ontology)))
  :definedp #'(lambda (name) (get-domain-class name)))

#+:lispworks-dspec
(dspec:define-dspec-class def-ontology nil "OCML Def-ontology"
  :pretty-name "Def-ontology"
  :canonicalize #'(lambda (dspec)
		    (let ((name (cadr dspec))
                          (ontology (third dspec)))
                      `(def-ontology ,name ,ontology)))
  :definedp #'(lambda (name) (get-ontology name)))

#+:lispworks-dspec
(dspec:define-dspec-class def-instance nil "OCML Def-instance"
  :pretty-name "Def-instance"
  :canonicalize #'(lambda (dspec)
		    (let ((name (cadr dspec))
                          (parent (third dspec))
                          (ontology (fourth dspec)))
                      `(def-instance ,name ,parent ,ontology)))
  :definedp #'(lambda (name) (find-current-instance name)))

#+:lispworks-dspec
(dspec:define-dspec-class def-relation nil "OCML Def-relation"
  :pretty-name "Def-relation"
  :canonicalize #'(lambda (dspec)
		    (let ((name (cadr dspec))
                          (ontology (third dspec)))
                      `(def-relation ,name ,ontology)))
  :definedp #'(lambda (name) (get-relation name)))

#+:lispworks-dspec
(dspec:define-dspec-class def-function nil "OCML Def-function"
  :pretty-name "Def-function"
  :canonicalize #'(lambda (dspec)
		    (let ((name (cadr dspec))
                          (ontology (third dspec)))
                      `(def-function ,name ,ontology)))
  :definedp #'(lambda (name) (get-function name)))

#+:lispworks-dspec
(dspec:define-dspec-class def-procedure nil "OCML Def-procedure"
  :pretty-name "Def-procedure"
  :canonicalize #'(lambda (dspec)
		    (let ((name (cadr dspec))
                          (ontology (third dspec)))
                      `(def-procedure ,name ,ontology)))
  :definedp #'(lambda (name) (get-function name)))

#+:lispworks-dspec
(dspec:define-dspec-class def-axiom nil "OCML Def-axiom"
  :pretty-name "Def-axiom"
  :canonicalize #'(lambda (dspec)
		    (let ((name (cadr dspec))
                          (ontology (third dspec)))
                      `(def-axiom ,name ,ontology)))
  :definedp #'(lambda (name) (get-axiom name)))

#+:lispworks-dspec
(dspec:define-dspec-class def-rule nil "OCML Def-rule"
  :pretty-name "Def-Rule"
  :canonicalize #'(lambda (dspec)
		    (let ((name (cadr dspec))
                          (ontology (third dspec)))
                      `(def-rule ,name ,ontology)))
  :definedp #'(lambda (name) (get-rule name)))


#+:lispworks-dspec
(dspec:define-dspec-class def-relation-instances nil "OCML def-relation-instances"
  :pretty-name "Def-Relation-Instances"
  :canonicalize #'(lambda (dspec)
		    (let ((name (cadr dspec))
                          (ontology (third dspec)))
                      `(def-relation-instances ,name ,ontology)))
  :definedp #'(lambda (x) (and (listp x) (get-relation-instance x))))




